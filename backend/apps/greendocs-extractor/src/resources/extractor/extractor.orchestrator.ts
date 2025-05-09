import {TWorkspace} from '@cdoc/domain';
import {Injectable, OnApplicationBootstrap} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {Cron, CronExpression} from '@nestjs/schedule';
import {subDays, subHours} from 'date-fns';
import {DatabaseService, WorkspaceEntity} from 'libs/database';
import {LoggerService} from 'libs/logger';
import {IsNull, LessThan, MoreThan, Not, Or} from 'typeorm';
import * as workers from './workers';

@Injectable()
export class ExtractorOrchestrator implements OnApplicationBootstrap {
  constructor(
    protected readonly moduleRef: ModuleRef,
    protected readonly loggerService: LoggerService,
    protected readonly databaseService: DatabaseService
  ) {}

  // TODO: REMOVE THIS ON DEPLOY
  async onApplicationBootstrap(): Promise<void> {
    this.run().catch(console.error);
  }

  protected async shouldExtracProject(): Promise<boolean> {
    const count = await this.databaseService.getRepository(WorkspaceEntity).count({
      where: {updatedAt: MoreThan(subDays(new Date(), 1))},
    });
    return !count;
  }

  protected async getWorkspaceToExtractSupplier(referenceDate: Date): Promise<TWorkspace | undefined> {
    const workspace = await this.databaseService.getRepository(WorkspaceEntity).findOne({
      where: {
        suppliersExtractionAt: Or(IsNull(), LessThan(referenceDate)),
        submenuSelector: Not(IsNull()),
      },
    });
    if (workspace) {
      return workspace;
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async run(): Promise<void> {
    if (await this.shouldExtracProject()) {
      await this.moduleRef.get(workers.WorkspaceWorker).run();
    }
    this.loggerService.log('Starting Workspace extraction');

    const reference = subHours(new Date(), 1);
    while (true) {
      const workspace = await this.getWorkspaceToExtractSupplier(reference);
      if (!workspace) {
        break;
      }
      await this.moduleRef.get(workers.SupplierWorker).run(workspace);
    }
    this.loggerService.log(`Extraction finished using reference ${reference.toJSON()}`);
  }
}
