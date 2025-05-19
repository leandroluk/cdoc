import {TSpace} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import {Retry, TimeTrack} from 'libs/common';
import {DatabaseService, SpaceEntity} from 'libs/database';
import {LoggerService} from 'libs/logger';
import {Page} from 'puppeteer';
import {ExtractorEnv} from '../extractor.env';
import {BaseService} from './base.service';

@Injectable()
export class SpaceService extends BaseService {
  readonly spaceListSelector = '#lista_projetos .item_menu [onclick]';
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
  protected async extractPartialSpaceList(): Promise<Array<Partial<TSpace>>> {
    await this.page.waitForSelector(this.spaceListSelector);
    const evaluated = await this.page.evaluate(selector => {
      return [...document.querySelectorAll<HTMLDivElement>(selector)]
        .filter(el => el.getAttribute('onclick')?.startsWith('alterarProjeto'))
        .map<Partial<TSpace>>(el => ({
          greendocsId: Number(el.getAttribute('onclick')!.replace(/\D/g, '')),
          greendocsName: el.innerText.trim().replace(/\n|\r/, ''),
        }));
    }, this.spaceListSelector);
    return evaluated;
  }

  @TimeTrack()
  @Retry()
  protected async navigateToSpacePage(space: Partial<TSpace>): Promise<void> {
    await this.page.evaluate(id => (window as any).alterarProjeto(`${id}`), space.greendocsId);
    await this.page.waitForNavigation({waitUntil: 'networkidle0'});
    const cdocId = await this.page.evaluate(selectors => document.querySelector(selectors)?.id, this.cdocSelector);
    if (cdocId) {
      space.submenuSelector = `#div${cdocId}`;
    }
    space.link = this.page.url();
  }

  @TimeTrack()
  @Retry()
  protected async loadCdocSubmenu(space: Partial<TSpace>): Promise<void> {
    await this.page.click(this.cdocSelector);
    const cdocId = await this.page.evaluate(selectors => document.querySelector(selectors)!.id, this.cdocSelector);
    space.submenuSelector = `#div${cdocId}`;
    await this.page.waitForFunction(
      selectors => Number(document.querySelector(selectors)?.children.length) > 0,
      {},
      space.submenuSelector
    );
  }

  @TimeTrack()
  @Retry()
  protected async updateSpaceWithLinks(space: Partial<TSpace>): Promise<void> {
    const evaluated = await this.page.evaluate(selectors => {
      const anchorList = Array.from(document.querySelector(selectors)?.children ?? []);
      return anchorList.map(({title, href}: HTMLAnchorElement) => ({title, href}));
    }, space.submenuSelector as string);
    for (const anchor of evaluated) {
      if (/FORNECEDOR/i.test(anchor.title)) {
        space.suppliersViewLink = anchor.href;
      }
      if (/RESERVA/i.test(anchor.title)) {
        space.reserveViewLink = anchor.href;
      }
    }
  }

  @TimeTrack()
  @Retry()
  protected async upsertProject(space: Partial<SpaceEntity>): Promise<void> {
    const repository = this.databaseService.getRepository(SpaceEntity);
    const entity = repository.create(space);
    const replaceableList = this.databaseService.getReplaceableColumnDatabaseNames(SpaceEntity);
    const uniqueList = this.databaseService.getUniqueColumnDatabaseNames(SpaceEntity);
    await repository.createQueryBuilder().insert().values(entity).orUpdate(replaceableList, uniqueList).execute();
  }

  @TimeTrack()
  @Retry()
  async run(): Promise<void> {
    await this.login();
    await this.navigateToRootPage();
    const spaceList = await this.extractPartialSpaceList();
    for (const space of spaceList) {
      await this.navigateToSpacePage(space);
      if (space.submenuSelector) {
        await this.loadCdocSubmenu(space);
        await this.updateSpaceWithLinks(space);
      }
      await this.upsertProject(space);
    }
  }
}
