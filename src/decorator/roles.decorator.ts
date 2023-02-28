import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from './../auth/guards';
import { RoleEnum } from './../enums';

export const ROLES_KEY = 'roles';
export const Roles = (role: RoleEnum) =>
  applyDecorators(SetMetadata(ROLES_KEY, { role }), UseGuards(RolesGuard));
