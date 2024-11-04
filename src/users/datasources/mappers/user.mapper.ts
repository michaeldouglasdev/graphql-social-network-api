import {
  FollowModel,
  UserModel,
  UserRoleModel,
} from "@users/models/user.model";
import { FollowerDB, FollowingDB, UserDBModel } from "../model/user.db.model";
import { UserRole } from "@generated/types";

export class UserMapper {
  static mapFollowerDbToModel(followerDb: FollowerDB) {
    const { id, follower } = followerDb;
    const followerModel: FollowModel = {
      id,
      user: {
        ...follower,
        role: follower.role as UserRole,
      },
    };

    return followerModel;
  }
  static mapFollowerDbToModelList(listFollowerDb: FollowerDB[]) {
    return listFollowerDb.map((follower) =>
      this.mapFollowerDbToModel(follower)
    );
  }

  static mapFollowingDbToModel(followingDb: FollowingDB) {
    const { id, following } = followingDb;
    const followingModel: FollowModel = {
      id,
      user: {
        ...following,
        role: following.role as UserRole,
      },
    };

    return followingModel;
  }
  static mapFollowingDbToModelList(listFollowingDb: FollowingDB[]) {
    return listFollowingDb.map((following) =>
      this.mapFollowingDbToModel(following)
    );
  }

  static mapUserDbToModel(user: UserDBModel): UserModel {
    const userModel: UserModel = {
      ...user,
      role: this.mapRole(user.role),
    };

    return userModel;
  }

  static mapUserDbToModelList(users: UserDBModel[]): UserModel[] {
    return users.map((user) => this.mapUserDbToModel(user));
  }

  private static mapRole(role: string) {
    switch (role) {
      case "ADMIN":
        return UserRoleModel.ADMIN;
      case "VIP":
        return UserRoleModel.VIP;
      default:
        return UserRoleModel.DEFAULT;
    }
  }
}
