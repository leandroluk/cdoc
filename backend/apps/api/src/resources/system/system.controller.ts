import {THealthcheck} from '@cdoc/domain';
import {Controller, Get, HttpCode, HttpStatus, Sse} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {ApiExcludeEndpoint, ApiOkResponse, ApiOperation, ApiTags} from '@nestjs/swagger';
import {LoggerService} from 'libs/logger';
import {map, Observable} from 'rxjs';
import * as services from './services';

@ApiTags('system')
@Controller('system')
export class SystemController {
  constructor(
    readonly moduleRef: ModuleRef,
    readonly loggerService: LoggerService
  ) {}

  //#region healthcheck
  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Healthcheck'})
  @ApiOkResponse({
    description: 'Application is healthy',
    schema: THealthcheck.Result.swagger,
  })
  async healthcheck(): Promise<THealthcheck.Result> {
    return await this.moduleRef.get(services.Healthcheck).run();
  }
  //#endregion

  //#region log
  @ApiExcludeEndpoint()
  @Sse('log')
  log(): Observable<{data: string}> {
    return this.loggerService.getLogStream().pipe(map(log => ({data: log})));
  }
  //#endregion
}
