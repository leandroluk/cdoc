import {EProvider, TSsoAuthRedirect} from '@cdoc/domain';
import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {CommonEnv} from 'libs/common';

@Injectable()
export class SsoAuthRedirectService implements TSsoAuthRedirect {
  constructor(private readonly commonEnv: CommonEnv) {}

  async run(data: TSsoAuthRedirect.Data): Promise<string> {
    const state = Buffer.from(data.query.redirect, 'utf8').toString('base64url');
    const redirect = `${this.commonEnv.apiBaseUrl}/sso/${data.params.provider}/callback`;

    if (data.params.provider === EProvider.Microsoft) {
      const url = new URL('https://login.microsoftonline.com/common/oauth2/v2.0/authorize');
      url.searchParams.set('client_id', this.commonEnv.microsoftClientId);
      url.searchParams.set('redirect_uri', redirect);
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('scope', 'openid email profile offline_access');
      url.searchParams.set('state', state);
      url.searchParams.set('response_mode', 'query');
      return url.toString();
    }

    throw new InternalServerErrorException('Invalid provider');
  }
}
