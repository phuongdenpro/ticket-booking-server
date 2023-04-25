import { ROLES_KEY } from './../../decorator/roles.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from './../../enums';
import { DataSource } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    const type = user.type;

    const { role, roleAccess } = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
    ]);

    if (role === RoleEnum.STAFF) {
      if (type === RoleEnum.CUSTOMER) {
        return false;
      }
    }
    return true;
  }
}
