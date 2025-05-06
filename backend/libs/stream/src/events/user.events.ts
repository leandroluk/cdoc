import {type TCredential, type TOtp, type TUser} from '@cdoc/domain';
import {AbstractEvent} from './abstract.event';

export class UserCreatedEvent extends AbstractEvent<TUser> {}

export class UserUpdatedEvent extends AbstractEvent<TUser> {}

export class UserActivatedEvent extends AbstractEvent<TUser> {}

export class UserCredentialUpdatedEvent extends AbstractEvent<TUser & {Credential: TCredential}> {}

export class UserOtpUpdatedEvent extends AbstractEvent<TUser & {Otp: TOtp}> {}
