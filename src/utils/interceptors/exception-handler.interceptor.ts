import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { mappingTranslate } from '../translate.util';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MESS_CODE } from '../message.util';

const transform = (err): HttpException => {
  Logger.error(err);

  if (err instanceof HttpException) {
    const message = err.getResponse()['message'][0].split('.')[1];

    err['response']['error'] =
      mappingTranslate[message || err.getResponse()['message'][0]];
    err['response']['code'] = MESS_CODE[err.message];
    err['response']['message'] = err['options']['description']
      ? err['options']['description']
      : mappingTranslate[err.message];
    return err;
  }

  const newErr = new InternalServerErrorException(err.message);
  const response = newErr.getResponse();
  const error = response['error'];
  const message = response['message'];
  if (error === 'Internal Server Error') {
    newErr['response']['code'] = MESS_CODE.INTERNAL_SERVER_ERROR;
  } else {
    newErr['response']['code'] = MESS_CODE[message];
  }
  newErr.stack = err.stack;

  return newErr;
};

@Injectable()
export class ExceptionHandlerInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(catchError((err) => throwError(() => transform(err))));
  }
}
