import {Injectable} from '@nestjs/common';
import {LoggerService} from 'libs/logger';
import {DataSource, EntityManager, ObjectLiteral, Repository, type EntityTarget} from 'typeorm';
import {DatabaseEnv} from './database.env';
import * as entities from './entities';
import * as migrations from './migrations';

@Injectable()
export class DatabaseService {
  private readonly dataSource: DataSource;

  constructor(
    databaseEnv: DatabaseEnv,
    private readonly loggerService: LoggerService
  ) {
    this.dataSource = new DataSource({
      type: 'postgres',
      url: databaseEnv.connectionString,
      entities: Object.values(entities),
      migrations: Object.values(migrations),
      logging: databaseEnv.logging,
    });
  }
  async connect(): Promise<void> {
    try {
      await this.dataSource.initialize();
      await this.dataSource.runMigrations();
    } catch (error: any) {
      this.loggerService.log(`Failed to init. ${error.message}`);
      throw error;
    }
  }

  getReplaceableColumnDatabaseNames<T extends ObjectLiteral = any>(entity: EntityTarget<T>): string[] {
    const metadata = this.dataSource.getMetadata(entity);
    const replaceableColumnNames = metadata.columns.filter(column => !column.isPrimary && !column.isCreateDate);
    const uniqueColumnsAtClassLevel = new Set<string>();
    for (const unique of metadata.uniques) {
      for (const column of unique.columns) {
        uniqueColumnsAtClassLevel.add(column.databaseName);
      }
    }
    return replaceableColumnNames
      .filter(column => !uniqueColumnsAtClassLevel.has(column.propertyName))
      .map(column => column.databaseName);
  }

  getUniqueColumnDatabaseNames<T extends ObjectLiteral = any>(entity: EntityTarget<T>): string[] {
    const metadata = this.dataSource.getMetadata(entity);
    const uniqueColumnsAtClassLevel = new Set<string>();
    for (const unique of metadata.uniques) {
      for (const column of unique.columns) {
        uniqueColumnsAtClassLevel.add(column.databaseName);
      }
    }
    return Array.from(uniqueColumnsAtClassLevel);
  }

  getRepository<T extends ObjectLiteral = any>(entity: EntityTarget<T>): Repository<T> {
    return this.dataSource.getRepository(entity);
  }

  async transaction<U = unknown>(fn: (entityManager: EntityManager) => Promise<U>): Promise<U> {
    return await this.dataSource.transaction<U>(fn);
  }

  async ping(): Promise<void> {
    try {
      await this.dataSource.query('SELECT 1');
    } catch (error) {
      this.loggerService.error(`Failed to ping ${this.constructor.name}`, error);
      throw error;
    }
  }
}
