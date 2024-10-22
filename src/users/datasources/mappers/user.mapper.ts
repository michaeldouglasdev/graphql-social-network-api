import { FollowModel } from "@users/models/user.model";
import { FollowerDB, FollowingDB } from "../model/user.db.model";
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
}
