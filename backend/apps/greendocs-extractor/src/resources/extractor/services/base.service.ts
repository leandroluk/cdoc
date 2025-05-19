import {Injectable} from '@nestjs/common';
import {Retry, TimeTrack} from 'libs/common';
import {Page} from 'puppeteer';
import {ExtractorEnv} from '../extractor.env';

@Injectable()
export class BaseService {
  constructor(
    protected readonly extractorEnv: ExtractorEnv,
    protected readonly page: Page
  ) {}

  @TimeTrack()
  @Retry()
  protected async login(email = this.extractorEnv.email, password = this.extractorEnv.password): Promise<void> {
    // clear site data
    const client = await this.page.createCDPSession();
    await client.send('Network.clearBrowserCookies');
    await client.send('Network.clearBrowserCache');
    await this.page.evaluateOnNewDocument(() => [localStorage.clear(), sessionStorage.clear()]);
    // navigate to login with email page
    await this.page.goto(`${this.extractorEnv.baseUrl}/Account/LogOn?ReturnUrl=/&loginPrincipal=true`);
    await this.page.waitForSelector('#tdLogin');
    // input form and submit
    await this.page.type('#email', email);
    await this.page.type('#password', password);
    await this.page.click('#btnLogin');
    // wait for navigation
    await this.page.waitForSelector('.logout');
  }

  protected chunkArray<T>(array: T[], chunkSize = 50): Array<T[]> {
    const chunks: Array<T[]> = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
}
