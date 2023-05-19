import { Pagination } from './../../decorator';
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MESS_CODE } from '../message.util';

export interface Response<T> {
  statusCode: number;
  message: string;
  code?: string;
  data?: T;
  pagination?: Pagination;
  total?: number;
}

const transform = <T>(data?: T): Response<T> => {
  const statusCode = HttpStatus.OK;
  let message = HttpStatus[HttpStatus.OK];
  const code = MESS_CODE.SUCCESS;
  if (data?.['isText']) {
    return data['file'];
  }
  if (typeof data === 'string') {
    return { statusCode, message: data, code };
  }

  if (data?.['message'] && typeof data['message'] === 'string') {
    message = data['message'];
    delete data['message'];
    return { statusCode, message };
  }

  let pagination = {};
  if (data?.['pagination']) {
    const totalPage =
      data?.['total'] /
      (data?.['pagination']['take']
        ? data?.['pagination']['take']
        : data?.['pagination']['pageSize']);
    const lastPage =
      Math.floor(totalPage) < totalPage
        ? Math.floor(totalPage) + 1
        : Math.floor(totalPage);
    pagination = {
      page: data?.['pagination']['page'],
      pageSize: data?.['pagination']['pageSize'],
      lastPage,
      total: data?.['total'],
    };
  }

  return {
    statusCode,
    message,
    code,
    pagination: data?.['pagination'] ? pagination : undefined,
    data: data?.['dataResult'] ? data['dataResult'] : data,
  };
};

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(map(transform));
  }
}
