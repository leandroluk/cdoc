import {TOpenid, TSso, TUser, type TSession} from '@cdoc/domain';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {CacheService} from 'libs/cache';
import {uuidv7} from 'uuidv7';
import {SessionEnv} from './session.env';

@Injectable()
export class SessionService {
  readonly cacheUserKey = 'user';

  constructor(
    private readonly sessionEnv: SessionEnv,
    private readonly cacheService: CacheService
  ) {}

  async get(sessionId: string): Promise<TSession | null> {
    const key = [this.cacheUserKey, '*', this.sessionEnv.prefix, sessionId].join(':');
    const session = await this.cacheService.get<TSession>(key);
    return session;
  }

  async create(
    user: TUser,
    expiresInSeconds: number,
    ssoProvider?: TSso['provider'],
    openidToken?: TOpenid.Token
  ): Promise<TSession> {
    const session: TSession = {
      id: uuidv7(),
      updatedAt: new Date(),
      ssoProvider: ssoProvider,
      refreshToken: openidToken?.refresh_token,
      userId: user.id,
    };
    const key = [this.cacheUserKey, user.id, this.sessionEnv.prefix, session.id].join(':');
    await this.cacheService.set(key, session, expiresInSeconds);
    return session;
  }

  async update(user: TUser, sessionId: string, expiresInSeconds?: number): Promise<void> {
    const key = [this.cacheUserKey, user.id, this.sessionEnv.prefix, sessionId].join(':');
    const session = await this.cacheService.get<TSession>(key);
    if (session) {
      return await this.cacheService.set(key, {...session, user}, expiresInSeconds);
    }
    throw new UnauthorizedException();
  }

  async delete(sessionId: string): Promise<void> {
    const key = [this.cacheUserKey, '*', this.sessionEnv.prefix, sessionId].join(':');
    const exists = await this.cacheService.has(key);
    if (exists) {
      await this.cacheService.del(key);
    }
  }
}
