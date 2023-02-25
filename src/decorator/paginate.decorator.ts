import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

import { toBoolean } from './../utils';

export type Pagination = {
  skip?: number;
  take?: number;
  page?: number;
  pageSize?: number;
  total?: number;
};

export const GetPagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const paginationParams: Pagination = {
      skip: !toBoolean(req.query.isAll) ? skip : undefined,
      take: !toBoolean(req.query.isAll) ? take : undefined,
      page,
      pageSize,
    };
    return paginationParams;
  },
  [
    (target: any, key: string) => {
      // Here it is. Use the `@ApiQuery` decorator purely as a function to define the meta only once here.
      ApiQuery({
        name: 'isAll',
        schema: { default: false, type: 'boolean' },
        required: false,
      })(target, key, Object.getOwnPropertyDescriptor(target, key));
      ApiQuery({
        name: 'page',
        schema: { default: 1, type: 'number', minimum: 1 },
        required: false,
      })(target, key, Object.getOwnPropertyDescriptor(target, key));
      ApiQuery({
        name: 'pageSize',
        schema: { default: 10, type: 'number', minimum: 0 },
        required: false,
      })(target, key, Object.getOwnPropertyDescriptor(target, key));
    },
  ],
);
