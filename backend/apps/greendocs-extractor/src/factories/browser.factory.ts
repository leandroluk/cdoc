import {FactoryProvider} from '@nestjs/common';
import puppeteer, {Browser} from 'puppeteer';
import {AppEnv} from '../app.env';

export const browserFactory: FactoryProvider<Browser> = {
  provide: Browser,
  durable: true,
  inject: [AppEnv],
  async useFactory(appEnv: AppEnv) {
    const browser = await puppeteer.launch({
      headless: appEnv.headless,
      args: ['--start-fullscreen'],
      defaultViewport: null,
    });
    return browser;
  },
};
