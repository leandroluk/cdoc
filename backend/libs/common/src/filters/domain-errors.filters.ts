/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {NetworkError, NotAcceptableError, ServerError, UnauthorizedError, ValidationError} from '@cdoc/domain';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import {Response} from 'express';
import {NotFoundError} from 'rxjs';

const errorMap = new Map<Function, (e: Error) => HttpException>([
  [NetworkError, e => new ServiceUnavailableException(e.message)],
  [NotAcceptableError, e => new NotAcceptableException(e.message)],
  [NotFoundError, e => new NotFoundException(e.message)],
  [ServerError, e => new InternalServerErrorException(e.message)],
  [UnauthorizedError, e => new UnauthorizedException(e.message)],
  [ValidationError, e => new BadRequestException(e.message)],
]);

@Catch()
export class DomainErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let httpException: HttpException;

    if (exception instanceof HttpException) {
      httpException = exception;
    } else if (exception instanceof Error) {
      const mapped = errorMap.get(exception.constructor);
      httpException = mapped ? mapped(exception) : new InternalServerErrorException(exception.message);
    } else {
      httpException = new InternalServerErrorException('Unknown error');
    }

    const status = httpException.getStatus();
    const resBody = httpException.getResponse();

    response.status(status).json(resBody);
  }
}
