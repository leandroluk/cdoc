import {type TSession} from '@cdoc/domain';
import {AbstractEvent} from './abstract.event';

export class SessionCreatedEvent extends AbstractEvent<TSession> {}

export class SessionUpdatedEvent extends AbstractEvent<TSession> {}

export class SessionRemovedEvent extends AbstractEvent<TSession> {}
