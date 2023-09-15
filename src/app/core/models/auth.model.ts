import { User } from "./user.model";

export interface Auth extends User {
  accessToken: string;
  refreshToken: string;
}
