import {type FactoryProvider} from '@nestjs/common';
import {Browser, Page} from 'puppeteer';

export const pageFactory: FactoryProvider<Page> = {
  provide: Page,
  durable: true,
  inject: [Browser],
  async useFactory(browser: Browser) {
    const page = await browser.newPage();
    return page;
  },
};
