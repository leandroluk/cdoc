import {TSession} from '@cdoc/domain';
import {Controller, HttpCode, HttpStatus, Post, UseGuards} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {ApiCookieAuth, ApiNoContentResponse, ApiOperation, ApiTags} from '@nestjs/swagger';
import {CookieAuthGuard} from 'libs/common';
import {GetSession} from 'libs/session';
import * as services from './services';

@ApiCookieAuth()
@UseGuards(CookieAuthGuard)
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly moduleRef: ModuleRef) {}

  //#region logoffUser
  @Post('logoff')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({summary: 'Logoff user'})
  @ApiNoContentResponse({description: 'Logoff succeeded'})
  async logoffUser(
    @GetSession() session: TSession //
  ): Promise<void> {
    await this.moduleRef.get(services.LogoffUserService).run({session});
  }
  //#endregion
}
