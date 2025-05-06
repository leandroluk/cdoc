import {type FactoryProvider} from '@nestjs/common';
import puppeteer, {Browser} from 'puppeteer';
import {ExtractorEnv} from '../extractor.env';

export const browserFactory: FactoryProvider<Browser> = {
  provide: Browser,
  durable: true,
  inject: [ExtractorEnv],
  async useFactory(appEnv: ExtractorEnv) {
    const browser = await puppeteer.launch({
      headless: appEnv.headless,
      args: ['--start-fullscreen'],
      defaultViewport: null,
    });
    return browser;
  },
};
