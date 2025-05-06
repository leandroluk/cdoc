import {COOKIE_SESSION_ID, type TSession} from '@cdoc/domain';
import {type CanActivate, type ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {type Request} from 'express';
import {SessionService} from 'libs/session';

@Injectable()
export class CookieAuthGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest<Request & {session: TSession | null}>();
      req.session = await this.sessionService.get(req.cookies[COOKIE_SESSION_ID]);
      if (req.session) {
        return true;
      }
    } catch {
      // ! no need catches it
    }
    throw new UnauthorizedException('Session expired.');
  }
}
