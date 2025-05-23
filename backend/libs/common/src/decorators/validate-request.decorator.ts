import {ValidationError} from '@cdoc/domain';
import {
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import {ApiBadRequestResponse} from '@nestjs/swagger';
import {type Request} from 'express';
import type Joi from 'joi';
import {type Observable} from 'rxjs';

export function ValidateRequest<T extends Partial<Request> = Partial<Request>>(
  schema: Joi.ObjectSchema<T>
): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    ApiBadRequestResponse({description: 'Invalid request'}),
    UseInterceptors(new ValidateRequestInterceptor(schema))
  );
}

class ValidateRequestInterceptor implements NestInterceptor {
  constructor(readonly schema: Joi.ObjectSchema<any>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request: Request = context.switchToHttp().getRequest();

    const data = {
      params: request.params,
      query: request.query,
      headers: request.headers,
      body: request.body,
      file: request.file,
      files: request.files,
    };

    const {error, value} = this.schema.validate(data, {
      abortEarly: true,
      allowUnknown: true,
      stripUnknown: true,
    });

    if (error) {
      throw new ValidationError(error.message);
    }

    Object.assign(request.params, value.params ?? request.params);
    Object.assign(request.query, value.query ?? request.query);
    Object.assign(request.headers, value.headers ?? request.headers);
    Object.assign(request.body ?? {}, value.body ?? request.body);

    return next.handle();
  }
}
