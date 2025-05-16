import {TSpace, TSupplier} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import {Retry, TimeTrack} from 'libs/common';
import {DatabaseService, SpaceEntity, SupplierEntity} from 'libs/database';
import {Page} from 'puppeteer';
import {ExtractorEnv} from '../extractor.env';
import {AuthWorker} from './auth.worker';

@Injectable()
export class SupplierWorker extends AuthWorker {
  readonly dataScrapperAttribute = 'data-scrapper';
  readonly paginationSelector = 'select#PaginarPor';
  readonly instanceHeaderSelector = '#acoes_Objeto';
  readonly instanceContentSelector = '#conteudo_instancia form #infoBasica';

  constructor(
    appEnv: ExtractorEnv,
    page: Page,
    protected readonly databaseService: DatabaseService
  ) {
    super(appEnv, page);
  }

  @TimeTrack()
  @Retry()
  protected async navigateToSuppliersPage(
    suppliersViewLink: Exclude<TSpace['suppliersViewLink'], null>
  ): Promise<void> {
    await Promise.all([
      this.page.goto(suppliersViewLink), //
      this.page.waitForNavigation({waitUntil: 'networkidle0'}),
    ]);
    await this.page.waitForSelector('#lista_com_cabecalho #itens table');
  }

  @TimeTrack()
  @Retry()
  protected async changePagination(): Promise<void> {
    await this.page.waitForSelector(this.paginationSelector);
    await this.page.evaluate(attribute => {
      document.querySelector('#hiddenTotalEncontrados')?.setAttribute(attribute, '1');
    }, this.dataScrapperAttribute);
    const maxValue = await this.page.evaluate(selector => {
      const selectElement = document.querySelector<HTMLOptionElement>(selector);
      const childList = [...selectElement!.children] as HTMLOptionElement[];
      return Math.max(...childList.map(item => Number(item.value)));
    }, this.paginationSelector);
    await Promise.all([
      this.page.select(this.paginationSelector, `${maxValue}`),
      this.page.waitForSelector(`[${this.dataScrapperAttribute}]`, {hidden: true}),
    ]);
  }

  @TimeTrack()
  @Retry()
  protected async loadAllPages(): Promise<void> {
    await this.page.waitForSelector('#text-exibindo1_');
    while (true) {
      const evaluated = await this.page.evaluate(() => ({
        items: document.querySelector<HTMLElement>('#text-exibindo1_')?.innerText.trim(),
        total: document.querySelector<HTMLElement>('#text-exibindo2_')?.innerText.trim(),
      }));
      if (Number(evaluated.items) >= Number(evaluated.total)) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  @TimeTrack()
  @Retry()
  protected async extractPartialSupplierList(): Promise<
    Array<
      Pick<TSupplier, 'link' | 'greendocsDocId' | 'greendocsInstanceId' | 'greendocsName' | 'greendocsInAttentionBy'>
    >
  > {
    const evaluated = await this.page.evaluate(() => {
      return [...document.querySelectorAll<HTMLTableRowElement>('#documentos .item.clicavel')].map(tr => {
        const [tdName, tdInAttentionBy] = tr.querySelectorAll<HTMLTableCellElement>('td[title]');
        return {
          link: tdName.querySelector<HTMLAnchorElement>('a')!.href,
          greendocsDocId: Number(tr.getAttribute('data-iddoc')),
          greendocsInstanceId: Number(tr.getAttribute('data-idinstancia')),
          greendocsName: tdName.title,
          greendocsInAttentionBy: tdInAttentionBy.title,
        } satisfies Partial<TSupplier>;
      });
    });
    return evaluated;
  }

  @TimeTrack()
  @Retry()
  protected async navigateToSupplierPage(link: TSupplier['link']): Promise<void> {
    await this.page.goto(link);
    await this.page.waitForSelector(this.instanceContentSelector);
  }

  @TimeTrack()
  @Retry()
  protected async completeSupplierFromHeader(supplier: Partial<TSupplier>): Promise<void> {
    const evaluated = await this.page.evaluate(selector => {
      const responsibleRegexMatch = /^respons.+:\s/i;
      const situationRegexMatch = /^situa.+:\s/i;
      const div = document.querySelector<HTMLDivElement>(selector)!;
      const textList = [...div.parentNode!.children].map((item: HTMLDivElement) => item.innerText);
      return {
        greendocsResponsible:
          textList
            .find(text => responsibleRegexMatch.test(text))
            ?.replace(responsibleRegexMatch, '')
            .trim() ?? '',
        greendocsSituation:
          textList
            .find(text => situationRegexMatch.test(text))
            ?.replace(situationRegexMatch, '')
            .trim() ?? '',
      } satisfies Partial<TSupplier>;
    }, this.instanceHeaderSelector);
    Object.assign(supplier, evaluated);
  }

  @TimeTrack()
  @Retry()
  protected async completeSupplierFromContent(supplier: Partial<TSupplier>): Promise<void> {
    const evaluated = await this.page.evaluate(selector => {
      const div = document.querySelector<HTMLElement>(selector)!;
      return {
        greendocsSupplierName: div.querySelector<HTMLElement>('#tr_met_Nome_Fornecedor span')?.innerText?.trim() ?? '',
        greendocsAddress: div.querySelector<HTMLElement>('#tr_met_Endereco td:last-child > div')?.title ?? '',
        greendocsCity: div.querySelector<HTMLElement>('#tr_met_Cidade td:last-child > div')?.title ?? '',
        greendocsState: div.querySelector<HTMLElement>('#tr_met_Estado td:last-child > div')?.title ?? '',
        greendocsZipCode: div.querySelector<HTMLElement>('#tr_met_CEP td:last-child > div')?.title ?? '',
        greendocsEmail: div.querySelector<HTMLElement>('#tr_met_email td:last-child > div')?.title ?? '',
        greendocsPhone: div.querySelector<HTMLElement>('#tr_met_Telefone td:last-child > div')?.title ?? '',
      } satisfies Partial<TSupplier>;
    }, this.instanceContentSelector);
    Object.assign(supplier, evaluated);
  }

  @TimeTrack()
  @Retry()
  protected async upsertSupplier(supplier: Partial<TSupplier>): Promise<void> {
    const repository = this.databaseService.getRepository(SupplierEntity);
    const entity = repository.create(supplier);
    const replaceableList = this.databaseService.getReplaceableColumnDatabaseNames(SupplierEntity);
    const uniqueList = this.databaseService.getUniqueColumnDatabaseNames(SupplierEntity);
    await repository.createQueryBuilder().insert().values(entity).orUpdate(replaceableList, uniqueList).execute();
  }

  @TimeTrack()
  @Retry()
  protected async updateSpace(space: TSpace): Promise<void> {
    await this.databaseService //
      .getRepository(SpaceEntity)
      .update({id: space.id}, {suppliersExtractionAt: new Date()});
  }

  @TimeTrack()
  @Retry()
  async run(space: TSpace): Promise<void> {
    if (!space.suppliersViewLink) {
      return;
    }
    await this.login();
    await this.navigateToSuppliersPage(space.suppliersViewLink);
    await this.changePagination();
    await this.loadAllPages();
    const partialSupplierList: Array<Partial<TSupplier>> = await this.extractPartialSupplierList();
    for (const partialSupplier of partialSupplierList) {
      partialSupplier.spaceId = space.id;
      await this.navigateToSupplierPage(partialSupplier.link as string);
      await this.completeSupplierFromHeader(partialSupplier);
      await this.completeSupplierFromContent(partialSupplier);
      await this.upsertSupplier(partialSupplier);
    }
    await this.updateSpace(space);
  }
}
