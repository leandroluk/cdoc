import {TGetUserWithProfile, TSession, TUpdateUserProfile, TUploadUserProfilePicture} from '@cdoc/domain';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  StreamableFile,
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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import Joi from 'joi';
import {ValidateRequest} from 'libs/common';
import {GetSession, SessionAuthGuard} from 'libs/session';
import mimeTypes from 'mime-types';
import * as services from './services';

@ApiCookieAuth()
@UseGuards(SessionAuthGuard)
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly moduleRef: ModuleRef) {}

  //#region getUserPicture
  @Get('picture')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Get user picture'})
  @ApiOkResponse({
    description: 'Get successful',
    content: {'image/png': {schema: {type: 'string', format: 'binary'}}},
  })
  @ApiNotFoundResponse({description: "User doesn' have a picture"})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  async getUserPicture(
    @GetSession() session: TSession //
  ): Promise<StreamableFile> {
    const result = await this.moduleRef.get(services.GetUserPictureService).run({session});
    return new StreamableFile(result.file, {type: mimeTypes.lookup(result.picture) as string});
  }
  //#endregion

  //#region getUserWithProfile
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Get user profile'})
  @ApiOkResponse({description: 'Get successful', schema: TGetUserWithProfile.Result.swagger})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  async getUserWithProfile(
    @GetSession() session: TSession //
  ): Promise<TGetUserWithProfile.Result> {
    return await this.moduleRef.get(services.GetUserWithProfileService).run({session});
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

  //#region uploadUserProfilePicture
  @Post('profile/_upload/picture')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Upload user profile picture'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({schema: TUploadUserProfilePicture.Data.swagger})
  @ApiOkResponse({description: 'Upload sucessful'})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  @ValidateRequest(Joi.object({file: TUploadUserProfilePicture.Data.schema.extract('file')}))
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserProfilePicture(
    @GetSession() session: TSession, //
    @UploadedFile() file: Express.Multer.File
  ): Promise<void> {
    await this.moduleRef.get(services.UploadUserProfilePictureService).run({session, file});
  }
  //#endregion
}
