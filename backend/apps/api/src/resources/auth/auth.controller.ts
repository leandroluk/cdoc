import {
  COOKIE_SESSION_ID,
  EProvider,
  Swagger,
  TLoginAuthCredential,
  TOtpAuth,
  TRecoverAuth,
  TSsoAuthCallback,
  TSsoAuthRedirect,
} from '@cdoc/domain';
import {Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Res} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {
  ApiBody,
  ApiFoundResponse,
  ApiMovedPermanentlyResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
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
  @HttpCode(HttpStatus.SEE_OTHER)
  @ApiOperation({summary: 'Login account with credential'})
  @ApiQuery({
    name: 'redirect',
    description: 'Redirection URL when successful',
    schema: {type: 'string', format: 'url'},
    required: true,
  })
  @ApiBody({schema: TLoginAuthCredential.Data.Body.swagger})
  @ApiSeeOtherResponse({
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
    @Query() query: TLoginAuthCredential.Data.Query,
    @Body() body: TLoginAuthCredential.Data.Body,
    @Res({passthrough: true}) res: Response
  ): Promise<void> {
    const {id} = await this.moduleRef.get(services.LoginAuthCredentialService).run({query, body});
    res.cookie(COOKIE_SESSION_ID, id, {httpOnly: true, sameSite: 'none'});
    res.redirect(HttpStatus.SEE_OTHER, query.redirect);
  }
  //#endregion

  //#region recoverAuth
  @Post('recover')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Recover account credential'})
  @ApiBody({schema: TRecoverAuth.Data.Body.swagger})
  @ApiOkResponse({description: 'Recover successful'})
  @ApiNotAcceptableResponse({description: 'Invalid token'})
  @ApiNotFoundResponse({description: 'Cannot find account for change password'})
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
  @ApiNotFoundResponse({description: 'Could not find a account for receive email'})
  @ValidateRequest(TOtpAuth.Data.schema)
  async otpAuth(
    @Body() body: TOtpAuth.Data.Body //
  ): Promise<void> {
    await this.moduleRef.get(services.OtpAuthService).run({body});
  }
  //#endregion

  //#region ssoAuthCallback
  @Get('login/:provider/callback')
  @HttpCode(HttpStatus.SEE_OTHER)
  @ApiOperation({summary: 'Callback of SSO Provider'})
  @ApiParam({name: 'provider', schema: TSsoAuthCallback.Data.Params.swagger.properties.provider})
  @ApiMovedPermanentlyResponse({description: 'Failed to login with SSO'})
  @ApiSeeOtherResponse({description: 'Login with SSO successful'})
  async ssoAuthCallback(
    @Param() params: TSsoAuthCallback.Data.Params,
    @Query() query: TSsoAuthCallback.Data.Query,
    @Res({passthrough: true}) res: Response
  ): Promise<void> {
    const result = await this.moduleRef.get(services.SsoAuthCallbackService).run({params, query});
    if (result.id) {
      res.cookie('sid', result.id, {httpOnly: true, sameSite: 'none'});
      return res.redirect(HttpStatus.SEE_OTHER, result.redirect);
    }
    return res.redirect(HttpStatus.MOVED_PERMANENTLY, result.redirect);
  }
  //#endregion

  //#region ssoAuthRedirect
  @Get('login/:provider')
  @HttpCode(HttpStatus.FOUND)
  @ApiOperation({summary: 'Redirect to SSO Provider'})
  @ApiParam({name: 'provider', schema: Swagger.enum({enum: Object.values(EProvider)})})
  @ApiQuery({name: 'redirect', schema: {type: 'string', format: 'url'}})
  @ApiFoundResponse({description: 'Redirected successful'})
  @ValidateRequest(TSsoAuthRedirect.Data.schema)
  async ssoAuthRedirect(
    @Param() params: TSsoAuthRedirect.Data.Params,
    @Query() query: TSsoAuthRedirect.Data.Query,
    @Res({passthrough: true}) res: Response
  ): Promise<void> {
    const result = await this.moduleRef.get(services.SsoAuthRedirectService).run({params, query});
    res.redirect(result);
  }
  //#endregion
}
