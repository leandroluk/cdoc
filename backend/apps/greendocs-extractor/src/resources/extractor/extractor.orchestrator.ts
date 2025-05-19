import {TSpace} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {Cron, CronExpression} from '@nestjs/schedule';
import {subDays, subHours} from 'date-fns';
import {DatabaseService, SpaceEntity} from 'libs/database';
import {LoggerService} from 'libs/logger';
import {IsNull, LessThan, MoreThan, Not, Or} from 'typeorm';
import * as workers from './services';

@Injectable()
export class ExtractorOrchestrator {
  constructor(
    protected readonly moduleRef: ModuleRef,
    protected readonly loggerService: LoggerService,
    protected readonly databaseService: DatabaseService
  ) {}

  protected async shouldExtracProject(): Promise<boolean> {
    const count = await this.databaseService.getRepository(SpaceEntity).count({
      where: {updatedAt: MoreThan(subDays(new Date(), 1))},
    });
    return !count;
  }

  protected async getSpaceToExtractSupplier(referenceDate: Date): Promise<TSpace | undefined> {
    const space = await this.databaseService.getRepository(SpaceEntity).findOne({
      where: {
        suppliersExtractionAt: Or(IsNull(), LessThan(referenceDate)),
        submenuSelector: Not(IsNull()),
      },
    });
    if (space) {
      return space;
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async run(): Promise<void> {
    if (await this.shouldExtracProject()) {
      await this.moduleRef.get(workers.SpaceService).run();
    }
    this.loggerService.log('Starting Space extraction');

    const reference = subHours(new Date(), 1);
    while (true) {
      const space = await this.getSpaceToExtractSupplier(reference);
      if (!space) {
        break;
      }
      await this.moduleRef.get(workers.SupplierService).run(space);
    }
    this.loggerService.log(`Extraction finished using reference ${reference.toJSON()}`);
  }
}
