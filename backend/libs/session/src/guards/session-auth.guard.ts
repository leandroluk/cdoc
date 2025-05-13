import {COOKIE_SESSION_ID, UnauthorizedError, type TSession} from '@cdoc/domain';
import {Injectable, type CanActivate, type ExecutionContext} from '@nestjs/common';
import {type Request} from 'express';
import {SessionService} from '../session.service';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & {session: TSession | null}>();
    try {
      req.session = await this.sessionService.get(req.cookies[COOKIE_SESSION_ID]);
      if (req.session) {
        return true;
      }
    } catch {
      // ! no need catches it
    }
    throw new UnauthorizedError('Session expired.');
  }
}
