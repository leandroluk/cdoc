import {TLogoffUser, TSession} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import {SessionService} from 'libs/session';
import {SessionRemovedEvent, StreamService} from 'libs/stream';

@Injectable()
export class LogoffUserService implements TLogoffUser {
  constructor(
    private readonly streamService: StreamService,
    private readonly sessionService: SessionService
  ) {}

  async publishSessionRemovedEvent(session: TSession): Promise<void> {
    await this.streamService.publish(new SessionRemovedEvent(session));
  }

  async run(data: TLogoffUser.Data): Promise<void> {
    try {
      const session = await this.sessionService.get(data.session.id);
      if (session) {
        await this.sessionService.delete(data.session.id);
        await this.publishSessionRemovedEvent(session);
      }
    } catch {
      // ! no needs catch
    }
  }
}
