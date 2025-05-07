import {TProject} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import {Retry, TimeTrack} from 'libs/common';
import {DatabaseService, ProjectEntity} from 'libs/database';
import {LoggerService} from 'libs/logger';
import {Page} from 'puppeteer';
import {ExtractorEnv} from '../extractor.env';
import {AuthWorker} from './auth.worker';

@Injectable()
export class ProjectWorker extends AuthWorker {
  readonly projectListSelector = '#lista_projetos .item_menu [onclick]';
  readonly cdocSelector = '[title="CDOC"]';

  constructor(
    appEnv: ExtractorEnv,
    page: Page,
    readonly databaseService: DatabaseService,
    readonly loggerService: LoggerService
  ) {
    super(appEnv, page);
  }

  @TimeTrack()
  @Retry()
  protected async navigateToRootPage(): Promise<void> {
    await Promise.all([
      this.page.goto(`${this.extractorEnv.baseUrl}/Itens/Todos`), //
      this.page.waitForNavigation({waitUntil: 'networkidle0'}),
    ]);
    await this.page.waitForSelector('#lista_projetos');
  }

  @TimeTrack()
  @Retry()
  protected async extractPartialProjectList(): Promise<Array<Partial<TProject>>> {
    await this.page.waitForSelector(this.projectListSelector);
    const evaluated = await this.page.evaluate(selector => {
      return [...document.querySelectorAll<HTMLDivElement>(selector)]
        .filter(el => el.getAttribute('onclick')?.startsWith('alterarProjeto'))
        .map<Partial<TProject>>(el => ({
          greendocsId: Number(el.getAttribute('onclick')!.replace(/\D/g, '')),
          greendocsName: el.innerText.trim().replace(/\n|\r/, ''),
        }));
    }, this.projectListSelector);
    return evaluated;
  }

  @TimeTrack()
  @Retry()
  protected async navigateToProjectPage(project: Partial<TProject>): Promise<void> {
    await this.page.evaluate(id => (window as any).alterarProjeto(`${id}`), project.greendocsId);
    await this.page.waitForNavigation({waitUntil: 'networkidle0'});
    const cdocId = await this.page.evaluate(selectors => document.querySelector(selectors)?.id, this.cdocSelector);
    if (cdocId) {
      project.submenuSelector = `#div${cdocId}`;
    }
    project.link = this.page.url();
  }

  @TimeTrack()
  @Retry()
  protected async loadCdocSubmenu(project: Partial<TProject>): Promise<void> {
    await this.page.click(this.cdocSelector);
    const cdocId = await this.page.evaluate(selectors => document.querySelector(selectors)!.id, this.cdocSelector);
    project.submenuSelector = `#div${cdocId}`;
    await this.page.waitForFunction(
      selectors => Number(document.querySelector(selectors)?.children.length) > 0,
      {},
      project.submenuSelector
    );
  }

  @TimeTrack()
  @Retry()
  protected async updateProjectWithLinks(project: Partial<TProject>): Promise<void> {
    const evaluated = await this.page.evaluate(selectors => {
      const anchorList = Array.from(document.querySelector(selectors)?.children ?? []);
      return anchorList.map(({title, href}: HTMLAnchorElement) => ({title, href}));
    }, project.submenuSelector as string);
    for (const anchor of evaluated) {
      if (/FORNECEDOR/i.test(anchor.title)) {
        project.suppliersViewLink = anchor.href;
      }
      if (/RESERVA/i.test(anchor.title)) {
        project.reserveViewLink = anchor.href;
      }
    }
  }

  @TimeTrack()
  protected async upsertProject(project: Partial<ProjectEntity>): Promise<void> {
    const repository = this.databaseService.getRepository(ProjectEntity);
    const entity = repository.create(project);
    const replaceableList = this.databaseService.getReplaceableColumnDatabaseNames(ProjectEntity);
    const uniqueList = this.databaseService.getUniqueColumnDatabaseNames(ProjectEntity);
    await repository.createQueryBuilder().insert().values(entity).orUpdate(replaceableList, uniqueList).execute();
  }

  @TimeTrack()
  @Retry()
  async run(): Promise<void> {
    await this.login();
    await this.navigateToRootPage();
    const projectList = await this.extractPartialProjectList();
    for (const project of projectList) {
      await this.navigateToProjectPage(project);
      if (project.submenuSelector) {
        await this.loadCdocSubmenu(project);
        await this.updateProjectWithLinks(project);
      }
      await this.upsertProject(project);
    }
  }
}
