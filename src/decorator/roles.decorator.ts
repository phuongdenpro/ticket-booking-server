import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards';
import { RoleEnum } from 'src/enums';

export const ROLES_KEY = 'roles';
export const Roles = (role: RoleEnum) =>
  applyDecorators(SetMetadata(ROLES_KEY, { role }), UseGuards(RolesGuard));
