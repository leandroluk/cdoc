import {DataSource, type EntityTarget} from 'typeorm';
import {type DatabaseEnv} from './database.env';
import * as entities from './entities';
import * as migrations from './migrations';

export class DatabaseService extends DataSource {
  constructor(databaseEnv: DatabaseEnv) {
    super({
      type: 'postgres',
      url: databaseEnv.connectionString,
      entities: Object.values(entities),
      migrations: Object.values(migrations),
      logging: databaseEnv.logging,
    });
  }

  getReplaceableColumnDatabaseNames(entity: EntityTarget<any>): string[] {
    const metadata = this.getMetadata(entity);
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

  getUniqueColumnDatabaseNames(entity: EntityTarget<any>): string[] {
    const metadata = this.getMetadata(entity);
    const uniqueColumnsAtClassLevel = new Set<string>();
    for (const unique of metadata.uniques) {
      for (const column of unique.columns) {
        uniqueColumnsAtClassLevel.add(column.databaseName);
      }
    }
    return Array.from(uniqueColumnsAtClassLevel);
  }
}
