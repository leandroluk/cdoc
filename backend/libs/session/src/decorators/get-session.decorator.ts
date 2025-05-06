import {type TSession} from '@cdoc/domain';
import {createParamDecorator, type ExecutionContext} from '@nestjs/common';
import {type Request} from 'express';

export const GetSession = createParamDecorator(
  (
    _: unknown, //
    context: ExecutionContext
  ) => {
    return context.switchToHttp().getRequest<Request & {session?: TSession}>().session;
  }
);
