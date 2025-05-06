import {TGreendocsProject} from '@cdoc/domain';
import {Injectable, OnApplicationBootstrap} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {Cron, CronExpression} from '@nestjs/schedule';
import {subDays, subHours} from 'date-fns';
import {GreendocsProjectEntity} from 'libs/database';
import {LoggerService} from 'libs/logger';
import {DataSource, IsNull, LessThan, MoreThan, Not, Or} from 'typeorm';
import * as workers from './workers';

@Injectable()
export class ExtractorOrchestrator implements OnApplicationBootstrap {
  constructor(
    protected readonly moduleRef: ModuleRef,
    protected readonly loggerService: LoggerService,
    protected readonly dataSource: DataSource
  ) {}

  // TODO: REMOVE THIS ON DEPLOY
  async onApplicationBootstrap(): Promise<void> {
    this.run().catch(console.error);
  }

  protected async shouldExtracProject(): Promise<boolean> {
    const count = await this.dataSource.getRepository(GreendocsProjectEntity).count({
      where: {updatedAt: MoreThan(subDays(new Date(), 1))},
    });
    return !count;
  }

  protected async getProjectToExtractSupplier(referenceDate: Date): Promise<TGreendocsProject | undefined> {
    const project = await this.dataSource.getRepository(GreendocsProjectEntity).findOne({
      where: {
        suppliersExtractionAt: Or(IsNull(), LessThan(referenceDate)),
        submenuSelector: Not(IsNull()),
      },
    });
    if (project) {
      return project;
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async run(): Promise<void> {
    if (await this.shouldExtracProject()) {
      await this.moduleRef.get(workers.ProjectWorker).run();
    }
    this.loggerService.log('Starting project extraction}');

    const reference = subHours(new Date(), 1);
    while (true) {
      const project = await this.getProjectToExtractSupplier(reference);
      if (!project) {
        break;
      }
      await this.moduleRef.get(workers.SupplierWorker).run(project);
    }
    this.loggerService.log(`Extraction finished using reference ${reference.toJSON()}`);
  }
}
