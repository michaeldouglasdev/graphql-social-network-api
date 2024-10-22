import { UserModel } from "./user.model";

export interface LoginModel {
  accessToken: string;
  user: UserModel;
  expirationTime: string;
}