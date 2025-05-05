import {FactoryProvider} from '@nestjs/common';
import {LoggerService} from 'libs/logger';
import {DataSource} from 'typeorm';
import {DatabaseEnv} from '../database.env';
import * as entities from '../entities';

export const databaseClientFactory: FactoryProvider<DataSource> = {
  provide: DataSource,
  durable: true,
  inject: [DatabaseEnv],
  async useFactory(databaseEnv: DatabaseEnv) {
    const loggerService = new LoggerService('DatabaseModule.databaseClientFactory');
    try {
      const dataSource = new DataSource({
        type: 'postgres',
        url: databaseEnv.connectionString,
        entities: Object.values(entities),
        logging: databaseEnv.logging,
      });
      await dataSource.initialize();
      await dataSource.synchronize();
      loggerService.log('Connected.');
      return dataSource;
    } catch (error: any) {
      loggerService.log(`Failed to connect. ${error.message}`);
      throw error;
    }
  },
};
