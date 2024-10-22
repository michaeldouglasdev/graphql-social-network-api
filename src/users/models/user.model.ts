import { ConnectionInputModel } from "@core/connection/connection.model";

export interface UserModel {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRoleModel;
  postIds?: string[];
}

export enum UserRoleModel {
  DEFAULT = "DEFAULT",
  VIP = "VIP",
  ADMIN = "ADMIN",
}

export interface CreateUserInputModel {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginInputModel {
  username: string;
  password: string;
}

export interface UserFollowInputModel {
  connection: ConnectionInputModel;
}

export interface FollowModel {
  id: string;
  user: FollowUserModel;
}

export interface FollowUserModel {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRoleModel;
}
