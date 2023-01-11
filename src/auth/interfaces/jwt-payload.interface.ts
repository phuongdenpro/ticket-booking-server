import { RoleEnum } from "src/enums";

export interface JwtPayload {
  id: string;
  email: string;
  type: RoleEnum;
}
