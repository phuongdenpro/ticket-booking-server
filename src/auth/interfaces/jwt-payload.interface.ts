import { RoleEnum } from "src/enums";

export interface JwtPayload {
  id: string;
  username: string;
  type: RoleEnum;
}
