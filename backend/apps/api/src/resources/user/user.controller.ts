import {TGetUserProfile, TSession, TUpdateUserProfile, TUploadUserProfileFile} from '@cdoc/domain';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {FileInterceptor} from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import Joi from 'joi';
import {ValidateRequest} from 'libs/common';
import {GetSession, SessionAuthGuard} from 'libs/session';
import * as services from './services';

@ApiCookieAuth()
@UseGuards(SessionAuthGuard)
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly moduleRef: ModuleRef) {}

  //#region getUserProfile
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Get user profile'})
  @ApiOkResponse({description: 'Get successful', schema: TGetUserProfile.Result.swagger})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  async getUserProfile(
    @GetSession() session: TSession //
  ): Promise<TGetUserProfile.Result> {
    return await this.moduleRef.get(services.GetUserProfileService).run({session});
  }
  //#endregion

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

  //#region updateUserProfile
  @Put('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Update user profile'})
  @ApiOkResponse({description: 'Set sucessful'})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  @ApiBody({schema: TUpdateUserProfile.Data.Body.swagger})
  @ValidateRequest(TUpdateUserProfile.Data.schema)
  async updateUserProfile(
    @GetSession() session: TSession, //
    @Body() body: TUpdateUserProfile.Data.Body
  ): Promise<void> {
    await this.moduleRef.get(services.UpdateUserProfileService).run({session, body});
  }
  //#endregion

  //#region uploadUserProfileFile
  @Post('profile/_upload/:file')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Upload user profile file'})
  @ApiConsumes('multipart/form-data')
  @ApiParam({name: 'file', schema: TUploadUserProfileFile.Data.Params.swagger.properties.file})
  @ApiBody({schema: TUploadUserProfileFile.Data.Body.swagger})
  @ApiOkResponse({description: 'Upload sucessful'})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  @ValidateRequest(
    Joi.object({
      file: TUploadUserProfileFile.Data.Body.schema.extract('file'),
    })
  )
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserProfileFile(
    @GetSession() session: TSession, //
    @Param() params: TUploadUserProfileFile.Data.Params,
    @UploadedFile() file: Express.Multer.File
  ): Promise<void> {
    await this.moduleRef.get(services.UploadUserProfileFileService).run({
      params,
      session,
      body: {file},
    });
  }
  //#endregion
}
