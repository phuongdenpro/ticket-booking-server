import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from './../auth/guards';
import { RoleEnum } from './../enums';

export const ROLES_KEY = 'roles';
export const Role = (role: RoleEnum) =>
  applyDecorators(SetMetadata(ROLES_KEY, { role }), UseGuards(RolesGuard));

export const Roles = (...roles: RoleEnum[]) =>
  applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(RolesGuard));
