import {TMicrosoftAuthRedirect} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import {CommonEnv} from 'libs/common';

@Injectable()
export class MicrosoftAuthRedirectService implements TMicrosoftAuthRedirect {
  constructor(private readonly commonEnv: CommonEnv) {}

  async run(data: TMicrosoftAuthRedirect.Data): Promise<string> {
    const url = new URL('https://login.microsoftonline.com/common/oauth2/v2.0/authorize');
    url.searchParams.set('client_id', this.commonEnv.microsoftClientId);
    url.searchParams.set('redirect_uri', `${this.commonEnv.apiBaseUrl}/auth/login/microsoft/callback`);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'openid profile email offline_access User.Read');
    url.searchParams.set('state', Buffer.from(data.query.redirect, 'utf8').toString('base64url'));
    url.searchParams.set('response_mode', 'query');
    return url.toString();
  }
}
