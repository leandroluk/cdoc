import {TGreendocsProject} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import {Retry, TimeTrack} from 'libs/common';
import {GreendocsProjectEntity} from 'libs/database';
import {LoggerService} from 'libs/logger';
import {Page} from 'puppeteer';
import {DataSource} from 'typeorm';
import {ExtractorEnv} from '../extractor.env';
import {AbstractWorker} from '../generics';

@Injectable()
export class ProjectWorker extends AbstractWorker {
  readonly projectListSelector = '#lista_projetos .item_menu [onclick]';
  readonly cdocSelector = '[title="CDOC"]';
  readonly overwriteFields: Array<keyof TGreendocsProject> = [
    'name',
    'submenuSelector',
    'suppliersViewLink',
    'reserveViewLink',
  ];
  readonly conflictTarget: Array<keyof TGreendocsProject> = ['id'];

  constructor(
    appEnv: ExtractorEnv,
    page: Page,
    readonly dataSource: DataSource,
    readonly loggerService: LoggerService
  ) {
    super(appEnv, page);
  }

  @TimeTrack()
  @Retry()
  protected async navigateToRootPage(): Promise<void> {
    await Promise.all([
      this.page.goto(`${this.appEnv.baseUrl}/Itens/Todos`), //
      this.page.waitForNavigation({waitUntil: 'networkidle0'}),
    ]);
    await this.page.waitForSelector('#lista_projetos');
  }

  @TimeTrack()
  @Retry()
  protected async extractPartialGreendocsProjectList(): Promise<Array<Partial<TGreendocsProject>>> {
    await this.page.waitForSelector(this.projectListSelector);
    const evaluated = await this.page.evaluate(selector => {
      return [...document.querySelectorAll<HTMLDivElement>(selector)]
        .filter(el => el.getAttribute('onclick')?.startsWith('alterarProjeto'))
        .map<Partial<TGreendocsProject>>(el => ({
          id: Number(el.getAttribute('onclick')!.replace(/\D/g, '')),
          name: el.innerText.trim().replace(/\n|\r/, ''),
        }));
    }, this.projectListSelector);
    return evaluated;
  }

  @TimeTrack()
  @Retry()
  protected async navigateToProjectPage(greendocsProject: Partial<TGreendocsProject>): Promise<void> {
    await this.page.evaluate(id => (window as any).alterarProjeto(`${id}`), greendocsProject.id);
    await this.page.waitForNavigation({waitUntil: 'networkidle0'});
    const cdocId = await this.page.evaluate(selectors => document.querySelector(selectors)?.id, this.cdocSelector);
    if (cdocId) {
      greendocsProject.submenuSelector = `#div${cdocId}`;
    }
    greendocsProject.link = this.page.url();
  }

  @TimeTrack()
  @Retry()
  protected async loadCdocSubmenu(greendocsProject: Partial<TGreendocsProject>): Promise<void> {
    await this.page.click(this.cdocSelector);
    const cdocId = await this.page.evaluate(selectors => document.querySelector(selectors)!.id, this.cdocSelector);
    greendocsProject.submenuSelector = `#div${cdocId}`;
    await this.page.waitForFunction(
      selectors => Number(document.querySelector(selectors)?.children.length) > 0,
      {},
      greendocsProject.submenuSelector
    );
  }

  @TimeTrack()
  @Retry()
  protected async updateProjectWithLinks(greendocsProject: Partial<TGreendocsProject>): Promise<void> {
    const evaluated = await this.page.evaluate(selectors => {
      const anchorList = Array.from(document.querySelector(selectors)?.children ?? []);
      return anchorList.map(({title, href}: HTMLAnchorElement) => ({title, href}));
    }, greendocsProject.submenuSelector!);
    for (const anchor of evaluated) {
      if (/FORNECEDOR/i.test(anchor.title)) {
        greendocsProject.suppliersViewLink = anchor.href;
      }
      if (/RESERVA/i.test(anchor.title)) {
        greendocsProject.reserveViewLink = anchor.href;
      }
    }
  }

  @TimeTrack()
  protected async upsertGreendocsProject(greendocsProject: Partial<GreendocsProjectEntity>): Promise<void> {
    await this.dataSource
      .getRepository(GreendocsProjectEntity)
      .createQueryBuilder()
      .insert()
      .values(greendocsProject)
      .orUpdate(this.overwriteFields, this.conflictTarget)
      .execute();
  }

  @TimeTrack()
  async run(): Promise<void> {
    await this.login();
    await this.navigateToRootPage();
    const greendocsProjectList = await this.extractPartialGreendocsProjectList();
    for (const greendocsProject of greendocsProjectList) {
      await this.navigateToProjectPage(greendocsProject);
      if (greendocsProject.submenuSelector) {
        await this.loadCdocSubmenu(greendocsProject);
        await this.updateProjectWithLinks(greendocsProject);
      }
      await this.upsertGreendocsProject(greendocsProject);
    }
  }
}
