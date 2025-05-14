import {
  COOKIE_SESSION_ID,
  TLoginAuthCredential,
  TMicrosoftAuthCallback,
  TMicrosoftAuthRedirect,
  TOtpAuth,
  TRecoverAuth,
} from '@cdoc/domain';
import {Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Res} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {
  ApiBody,
  ApiFoundResponse,
  ApiMovedPermanentlyResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiSeeOtherResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {Response} from 'express';
import {ValidateRequest} from 'libs/common';
import * as services from './services';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly moduleRef: ModuleRef) {}

  //#region loginAuthCredential
  @Post('login/credential')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Login user with credential'})
  @ApiQuery({
    name: 'redirect',
    description: 'Redirection URL when successful',
    schema: {type: 'string', format: 'url'},
    required: true,
  })
  @ApiBody({schema: TLoginAuthCredential.Data.Body.swagger})
  @ApiOkResponse({
    description: 'Login successful',
    headers: {
      'Set-Cookie': {
        description: 'Session cookie',
        schema: {type: 'string', example: `${COOKIE_SESSION_ID}=xyz; HttpOnly; SameSite=None`},
      },
    },
  })
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  @ApiNotAcceptableResponse({description: 'Account requires activation'})
  @ValidateRequest(TLoginAuthCredential.Data.schema)
  async loginAuthCredential(
    @Body() body: TLoginAuthCredential.Data.Body,
    @Res({passthrough: true}) res: Response
  ): Promise<void> {
    const result = await this.moduleRef.get(services.LoginAuthCredentialService).run({body});
    res.setHeader('Set-Cookie', `${COOKIE_SESSION_ID}=${result.id}; Path=/;`);
    res.sendStatus(HttpStatus.OK);
  }
  //#endregion

  //#region recoverAuth
  @Post('recover')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Recover user credential'})
  @ApiBody({schema: TRecoverAuth.Data.Body.swagger})
  @ApiOkResponse({description: 'Recover successful'})
  @ApiNotAcceptableResponse({description: 'Invalid token'})
  @ApiNotFoundResponse({description: 'Cannot find user for change password'})
  @ValidateRequest(TRecoverAuth.Data.schema)
  async recoverAuth(
    @Body() body: TRecoverAuth.Data.Body //
  ): Promise<void> {
    await this.moduleRef.get(services.RecoverAuthService).run({body});
  }
  //#endregion

  //#region otpAuth
  @Post('otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Send OTP'})
  @ApiBody({schema: TOtpAuth.Data.Body.swagger})
  @ApiOkResponse({description: 'Request successful'})
  @ApiNotFoundResponse({description: 'Could not find a user for receive email'})
  @ValidateRequest(TOtpAuth.Data.schema)
  async otpAuth(
    @Body() body: TOtpAuth.Data.Body //
  ): Promise<void> {
    await this.moduleRef.get(services.OtpAuthService).run({body});
  }
  //#endregion

  //#region microsoftAuthCallback
  @Get('login/microsoft/callback')
  @HttpCode(HttpStatus.SEE_OTHER)
  @ApiOperation({summary: 'Callback of SSO Provider'})
  @ApiQuery({name: 'state', required: true, schema: {type: 'string'}})
  @ApiQuery({name: 'code', required: false, schema: {type: 'string'}})
  @ApiQuery({name: 'error', required: false, schema: {type: 'string'}})
  @ApiMovedPermanentlyResponse({description: 'Failed to login with SSO'})
  @ApiSeeOtherResponse({description: 'Login with SSO successful'})
  async microsoftAuthCallback(
    @Query() query: TMicrosoftAuthCallback.Data.Query,
    @Res({passthrough: true}) res: Response
  ): Promise<void> {
    const result = await this.moduleRef.get(services.MicrosoftAuthCallbackService).run({query});
    if (result.id) {
      res.cookie(COOKIE_SESSION_ID, result.id, {httpOnly: true, sameSite: 'none', secure: true});
      return res.redirect(HttpStatus.SEE_OTHER, result.redirect);
    }
    return res.redirect(HttpStatus.MOVED_PERMANENTLY, result.redirect);
  }
  //#endregion

  //#region microsoftAuthRedirect
  @Get('login/:provider')
  @HttpCode(HttpStatus.FOUND)
  @ApiOperation({summary: 'Redirect to SSO Provider'})
  @ApiQuery({name: 'redirect', schema: {type: 'string', format: 'url'}})
  @ApiFoundResponse({description: 'Redirected successful'})
  @ValidateRequest(TMicrosoftAuthRedirect.Data.schema)
  async microsoftAuthRedirect(
    @Query() query: TMicrosoftAuthRedirect.Data.Query,
    @Res({passthrough: true}) res: Response
  ): Promise<void> {
    const result = await this.moduleRef.get(services.MicrosoftAuthRedirectService).run({query});
    res.redirect(result);
  }
  //#endregion
}
