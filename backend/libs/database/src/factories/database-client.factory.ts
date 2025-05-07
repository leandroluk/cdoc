import {type FactoryProvider} from '@nestjs/common';
import {LoggerService} from 'libs/logger';
import {DatabaseEnv} from '../database.env';
import {DatabaseService} from '../database.service';

export const databaseClientFactory: FactoryProvider<DatabaseService> = {
  durable: true,
  provide: DatabaseService,
  inject: [DatabaseEnv],
  async useFactory(databaseEnv: DatabaseEnv) {
    const loggerService = new LoggerService('DatabaseModule.DatabaseService');
    try {
      const instance = new DatabaseService(databaseEnv);
      await instance.initialize();
      await instance.runMigrations();
      return instance;
    } catch (error: any) {
      loggerService.log(`Failed to connect. ${error.message}`);
      throw error;
    }
  },
};
