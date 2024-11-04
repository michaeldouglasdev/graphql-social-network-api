import { ConnectionModel } from "@core/connection/connection.model";
import { UserMapper } from "@users/datasources/mappers/user.mapper";
import { UserDBDatasource } from "@users/datasources/user.db.datasource";
import {
  CreateUserInputModel,
  FollowModel,
  LoginInputModel,
  UserFollowInputModel,
  UserModel,
  UserRoleModel,
  UsersInputModel,
} from "@users/models/user.model";

export class UserRepository {
  async create(data: CreateUserInputModel): Promise<UserModel> {
    const userDBDatasource = new UserDBDatasource();
    const user = await userDBDatasource.create(data);

    const userModel: UserModel = {
      ...user,
      role: user.role as UserRoleModel,
    };

    return userModel;
  }

  async get(id: string): Promise<UserModel> {
    const userDBDatasource = new UserDBDatasource();
    const user = (await userDBDatasource.get(id)) as UserModel;

    return user;
  }

  async login(data: LoginInputModel): Promise<UserModel> {
    const userDBDatasource = new UserDBDatasource();
    const user = (await userDBDatasource.login(data)) as UserModel;
    return user;
  }

  async list(data: UsersInputModel): Promise<ConnectionModel<UserModel>> {
    const userDBDatasource = new UserDBDatasource();
    const connection = await userDBDatasource.list(data);

    const edges = connection.edges.map((edge) => ({
      cursor: edge.cursor,
      node: UserMapper.mapUserDbToModel(edge.node),
    }));

    const connectionModel: ConnectionModel<UserModel> = {
      ...connection,
      edges,
    };
    return connectionModel;
  }

  async followers(
    id: string,
    data: UserFollowInputModel
  ): Promise<ConnectionModel<FollowModel>> {
    const userDBDatasource = new UserDBDatasource();
    const followersDB = await userDBDatasource.followers(id, data);

    const followersModel = followersDB.edges.map((edge) => ({
      cursor: edge.cursor,
      node: UserMapper.mapFollowerDbToModel(edge.node),
    }));
    const connectionFollowersModel: ConnectionModel<FollowModel> = {
      ...followersDB,
      edges: followersModel,
    };

    return connectionFollowersModel;
  }

  async following(
    id: string,
    data: UserFollowInputModel
  ): Promise<ConnectionModel<FollowModel>> {
    const userDBDatasource = new UserDBDatasource();
    const followingDB = await userDBDatasource.following(id, data);
    const followersModel = followingDB.edges.map((edge) => ({
      cursor: edge.cursor,
      node: UserMapper.mapFollowingDbToModel(edge.node),
    }));
    const connectionFollowingModel: ConnectionModel<FollowModel> = {
      ...followingDB,
      edges: followersModel,
    };

    return connectionFollowingModel;
  }

  async follow(fromUserId: string, toUserId: string): Promise<boolean> {
    const userDBDatasource = new UserDBDatasource();
    const success = await userDBDatasource.follow(fromUserId, toUserId);
    return success;
  }

  async unfollow(fromUserId: string, toUserId: string): Promise<boolean> {
    const userDBDatasource = new UserDBDatasource();
    const success = await userDBDatasource.unfollow(fromUserId, toUserId);
    return success;
  }

  async countFollowers(id: string): Promise<number> {
    const userDBDatasource = new UserDBDatasource();
    const count = await userDBDatasource.countFollowers(id);
    return count;
  }

  async countFollowing(id: string): Promise<number> {
    const userDBDatasource = new UserDBDatasource();
    const count = await userDBDatasource.countFollowing(id);
    return count;
  }

  async followerByCurrentUser(
    id: string,
    currentUserId: string
  ): Promise<boolean> {
    const userDBDatasource = new UserDBDatasource();
    return await userDBDatasource.followerByCurrentUser(id, currentUserId);
  }

  async followingByCurrentUser(
    id: string,
    currentUserId: string
  ): Promise<boolean> {
    const userDBDatasource = new UserDBDatasource();
    return await userDBDatasource.followingByCurrentUser(id, currentUserId);
  }

  async uploadAvatar(id: string, path: string): Promise<boolean> {
    const userDBDatasource = new UserDBDatasource();
    const success = await userDBDatasource.uploadAvatar(id, path);
    return success;
  }
}
