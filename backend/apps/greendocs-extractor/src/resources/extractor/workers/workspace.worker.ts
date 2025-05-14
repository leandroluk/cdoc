import {TWorkspace} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import {Retry, TimeTrack} from 'libs/common';
import {DatabaseService, WorkspaceEntity} from 'libs/database';
import {LoggerService} from 'libs/logger';
import {Page} from 'puppeteer';
import {ExtractorEnv} from '../extractor.env';
import {AuthWorker} from './auth.worker';

@Injectable()
export class WorkspaceWorker extends AuthWorker {
  readonly workspaceListSelector = '#lista_projetos .item_menu [onclick]';
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
  protected async extractPartialWorkspaceList(): Promise<Array<Partial<TWorkspace>>> {
    await this.page.waitForSelector(this.workspaceListSelector);
    const evaluated = await this.page.evaluate(selector => {
      return [...document.querySelectorAll<HTMLDivElement>(selector)]
        .filter(el => el.getAttribute('onclick')?.startsWith('alterarProjeto'))
        .map<Partial<TWorkspace>>(el => ({
          greendocsId: Number(el.getAttribute('onclick')!.replace(/\D/g, '')),
          greendocsName: el.innerText.trim().replace(/\n|\r/, ''),
        }));
    }, this.workspaceListSelector);
    return evaluated;
  }

  @TimeTrack()
  @Retry()
  protected async navigateToWorkspacePage(workspace: Partial<TWorkspace>): Promise<void> {
    await this.page.evaluate(id => (window as any).alterarProjeto(`${id}`), workspace.greendocsId);
    await this.page.waitForNavigation({waitUntil: 'networkidle0'});
    const cdocId = await this.page.evaluate(selectors => document.querySelector(selectors)?.id, this.cdocSelector);
    if (cdocId) {
      workspace.submenuSelector = `#div${cdocId}`;
    }
    workspace.link = this.page.url();
  }

  @TimeTrack()
  @Retry()
  protected async loadCdocSubmenu(workspace: Partial<TWorkspace>): Promise<void> {
    await this.page.click(this.cdocSelector);
    const cdocId = await this.page.evaluate(selectors => document.querySelector(selectors)!.id, this.cdocSelector);
    workspace.submenuSelector = `#div${cdocId}`;
    await this.page.waitForFunction(
      selectors => Number(document.querySelector(selectors)?.children.length) > 0,
      {},
      workspace.submenuSelector
    );
  }

  @TimeTrack()
  @Retry()
  protected async updateWorkspaceWithLinks(workspace: Partial<TWorkspace>): Promise<void> {
    const evaluated = await this.page.evaluate(selectors => {
      const anchorList = Array.from(document.querySelector(selectors)?.children ?? []);
      return anchorList.map(({title, href}: HTMLAnchorElement) => ({title, href}));
    }, workspace.submenuSelector as string);
    for (const anchor of evaluated) {
      if (/FORNECEDOR/i.test(anchor.title)) {
        workspace.suppliersViewLink = anchor.href;
      }
      if (/RESERVA/i.test(anchor.title)) {
        workspace.reserveViewLink = anchor.href;
      }
    }
  }

  @TimeTrack()
  @Retry()
  protected async upsertProject(workspace: Partial<WorkspaceEntity>): Promise<void> {
    const repository = this.databaseService.getRepository(WorkspaceEntity);
    const entity = repository.create(workspace);
    const replaceableList = this.databaseService.getReplaceableColumnDatabaseNames(WorkspaceEntity);
    const uniqueList = this.databaseService.getUniqueColumnDatabaseNames(WorkspaceEntity);
    await repository.createQueryBuilder().insert().values(entity).orUpdate(replaceableList, uniqueList).execute();
  }

  @TimeTrack()
  @Retry()
  async run(): Promise<void> {
    await this.login();
    await this.navigateToRootPage();
    const workspaceList = await this.extractPartialWorkspaceList();
    for (const workspace of workspaceList) {
      await this.navigateToWorkspacePage(workspace);
      if (workspace.submenuSelector) {
        await this.loadCdocSubmenu(workspace);
        await this.updateWorkspaceWithLinks(workspace);
      }
      await this.upsertProject(workspace);
    }
  }
}
