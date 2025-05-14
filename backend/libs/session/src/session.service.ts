import {TOpenid, TSso, TUser, UnauthorizedError, type TSession} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import {addMilliseconds} from 'date-fns';
import {CacheService} from 'libs/cache';
import ms from 'ms';
import {uuidv7} from 'uuidv7';
import {SessionEnv} from './session.env';

@Injectable()
export class SessionService {
  readonly cacheUserKey = 'user';
  readonly cacheSessionKey = 'session';

  constructor(
    private readonly sessionEnv: SessionEnv,
    private readonly cacheService: CacheService
  ) {}

  async get(sessionId: string): Promise<TSession | null> {
    const key = [this.cacheUserKey, '*', this.cacheSessionKey, sessionId].join(':');
    const session = await this.cacheService.get<TSession>(key);
    if (session) {
      await this.cacheService.refresh(key, ms(this.sessionEnv.accessTtl));
    }
    return session;
  }

  async create(user: TUser, ssoProvider?: TSso['provider'], openidToken?: TOpenid.Token): Promise<TSession> {
    const session: TSession = {
      id: uuidv7(),
      updatedAt: new Date(),
      ssoProvider: ssoProvider,
      refreshToken: openidToken?.refresh_token,
      userId: user.id,
      limitTtl: addMilliseconds(new Date(), ms(this.sessionEnv.limitTtl)),
    };
    const key = [this.cacheUserKey, user.id, this.cacheSessionKey, session.id].join(':');
    await this.cacheService.set(key, session, ms(this.sessionEnv.accessTtl) / 1000);
    return session;
  }

  async update(user: TUser, sessionId: string): Promise<void> {
    const key = [this.cacheUserKey, user.id, this.cacheSessionKey, sessionId].join(':');
    const session = await this.cacheService.get<TSession>(key);
    if (session && session.limitTtl > new Date()) {
      return await this.cacheService.set(key, {...session, user}, ms(this.sessionEnv.accessTtl) / 1000);
    }
    throw new UnauthorizedError();
  }

  async delete(sessionId: string): Promise<void> {
    const key = [this.cacheUserKey, '*', this.cacheSessionKey, sessionId].join(':');
    const exists = await this.cacheService.has(key);
    if (exists) {
      await this.cacheService.del(key);
    }
  }
}
