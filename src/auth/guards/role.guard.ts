import { ROLES_KEY } from 'src/decorator/roles.decorator';
import { AdminUser } from 'src/database/entities/admin-user.entity';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from 'src/enums';
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

    if (role === RoleEnum.ADMIN) {
      if (type === RoleEnum.CUSTOMER) {
        return false;
      }
    }
      return true;
  }
}
