import {TGreendocsProject, TGreendocsSupplier} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import {Retry, TimeTrack} from 'libs/common';
import {GreendocsProjectEntity, GreendocsSupplierEntity} from 'libs/database';
import {Page} from 'puppeteer';
import {DataSource} from 'typeorm';
import {ExtractorEnv} from '../extractor.env';
import {AbstractWorker} from '../generics';

@Injectable()
export class SupplierWorker extends AbstractWorker {
  readonly dataScrapperAttribute = 'data-scrapper';
  readonly paginationSelector = 'select#PaginarPor';
  readonly instanceHeaderSelector = '#acoes_Objeto';
  readonly instanceContentSelector = '#conteudo_instancia form #infoBasica';
  readonly overwriteFields: Array<keyof TGreendocsSupplier> = [
    'link',
    'name',
    'supplierName',
    'address',
    'city',
    'state',
    'zipCode',
    'email',
    'phone',
    'responsible',
    'greendocsProjectId',
  ];
  readonly conflictTarget: Array<keyof TGreendocsSupplier> = ['id'];

  constructor(
    appEnv: ExtractorEnv,
    page: Page,
    protected readonly dataSource: DataSource
  ) {
    super(appEnv, page);
  }

  @TimeTrack()
  @Retry()
  protected async navigateToSuppliersPage(
    suppliersViewLink: Exclude<TGreendocsProject['suppliersViewLink'], null>
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
  protected async extractPartialSupplierList(): Promise<Array<Partial<TGreendocsSupplier>>> {
    const evaluated = await this.page.evaluate(() => {
      return [...document.querySelectorAll<HTMLTableRowElement>('#documentos .item.clicavel')].map(tr => {
        const [tdName, tdInAttentionBy] = tr.querySelectorAll<HTMLTableCellElement>('td[title]');
        return {
          id: Number(tr.getAttribute('data-iddoc')),
          instanceId: Number(tr.getAttribute('data-idinstancia')),
          link: tdName.querySelector<HTMLAnchorElement>('a')?.href,
          name: tdName.title,
          inAttentionBy: tdInAttentionBy.title,
        } satisfies Partial<TGreendocsSupplier>;
      });
    });
    return evaluated;
  }

  @TimeTrack()
  @Retry()
  protected async navigateToSupplierPage(link: TGreendocsSupplier['link']): Promise<void> {
    await this.page.goto(link);
    await this.page.waitForSelector(this.instanceContentSelector);
  }

  @TimeTrack()
  protected async extractFromHeader(greendocsSupplier: Partial<TGreendocsSupplier>): Promise<void> {
    const evaluated = await this.page.evaluate(selector => {
      const responsibleRegexMatch = /^respons.+:\s/i;
      const situationRegexMatch = /^situa.+:\s/i;
      const div = document.querySelector<HTMLDivElement>(selector)!;
      const textList = [...div.parentNode!.children].map((item: HTMLDivElement) => item.innerText);
      return {
        responsible:
          textList
            .find(text => responsibleRegexMatch.test(text))
            ?.replace(responsibleRegexMatch, '')
            .trim() ?? '',
        situation:
          textList
            .find(text => situationRegexMatch.test(text))
            ?.replace(situationRegexMatch, '')
            .trim() ?? '',
      } satisfies Partial<TGreendocsSupplier>;
    }, this.instanceHeaderSelector);
    Object.assign(greendocsSupplier, evaluated);
  }

  @TimeTrack()
  protected async extractFromContent(greendocsSupplier: Partial<TGreendocsSupplier>): Promise<void> {
    const evaluated = await this.page.evaluate(selector => {
      const div = document.querySelector<HTMLElement>(selector)!;
      return {
        supplierName: div.querySelector<HTMLElement>('#tr_met_Nome_Fornecedor span')?.innerText?.trim() ?? '',
        address: div.querySelector<HTMLElement>('#tr_met_Endereco td:last-child > div')?.title ?? '',
        city: div.querySelector<HTMLElement>('#tr_met_Cidade td:last-child > div')?.title ?? '',
        state: div.querySelector<HTMLElement>('#tr_met_Estado td:last-child > div')?.title ?? '',
        zipCode: div.querySelector<HTMLElement>('#tr_met_CEP td:last-child > div')?.title ?? '',
        email: div.querySelector<HTMLElement>('#tr_met_email td:last-child > div')?.title ?? '',
        phone: div.querySelector<HTMLElement>('#tr_met_Telefone td:last-child > div')?.title ?? '',
      } satisfies Partial<TGreendocsSupplier>;
    }, this.instanceContentSelector);
    Object.assign(greendocsSupplier, evaluated);
  }

  @TimeTrack()
  protected async upsertGreendocsSupplier(greendocsSupplier: Partial<TGreendocsSupplier>): Promise<void> {
    await this.dataSource
      .getRepository(GreendocsSupplierEntity)
      .createQueryBuilder()
      .insert()
      .values(greendocsSupplier)
      .orUpdate(this.overwriteFields, this.conflictTarget)
      .execute();
  }

  protected async updateGreendocsProject(greendocsProject: TGreendocsProject): Promise<void> {
    await this.dataSource
      .getRepository(GreendocsProjectEntity)
      .update({id: greendocsProject.id}, {suppliersExtractionAt: new Date()});
  }

  @TimeTrack()
  async run(greendocsProject: TGreendocsProject): Promise<void> {
    await this.login();
    await this.navigateToSuppliersPage(greendocsProject.suppliersViewLink!);
    await this.changePagination();
    await this.loadAllPages();
    const greendocsSupplierList = await this.extractPartialSupplierList();
    for (const grendocsSupplier of greendocsSupplierList) {
      grendocsSupplier.greendocsProjectId = greendocsProject.id;
      await this.navigateToSupplierPage(grendocsSupplier.link!);
      await this.extractFromHeader(grendocsSupplier);
      await this.extractFromContent(grendocsSupplier);
      await this.upsertGreendocsSupplier(grendocsSupplier);
    }
    await this.updateGreendocsProject(greendocsProject);
  }
}
