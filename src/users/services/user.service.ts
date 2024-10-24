import { JwtService } from "@core/services/jwt.service";
import { CreateUserInput, LoginInput } from "@generated/types";
import { Environment } from "@core/environment";
import { GraphQLError } from "graphql";
import {
  FollowModel,
  UserFollowInputModel,
  UserModel,
} from "@users/models/user.model";
import { LoginModel } from "@users/models/login.model";
import { UserRepository } from "@users/repositories/user.repository";
import { ConnectionModel } from "@core/connection/connection.model";
import { s3 } from "@core/services/s3.service";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export class UserService {
  async create(data: CreateUserInput): Promise<UserModel> {
    const userRepository = new UserRepository();
    const user = await userRepository.create(data);
    return user!;
  }

  async login(data: LoginInput) {
    const userRepository = new UserRepository();
    const user = await userRepository.login(data);
    const accessToken = JwtService.sign(user);
    const expirationTime = Environment.get("JWT_EXPIRATION_TIME");

    const login: LoginModel = {
      user,
      accessToken,
      expirationTime,
    };

    return login;
  }

  async get(id: string): Promise<UserModel> {
    const userRepository = new UserRepository();
    const user = await userRepository.get(id);

    return user!;
  }

  async list(): Promise<UserModel[]> {
    const userRepository = new UserRepository();
    const users = userRepository.list();

    return users;
  }

  async followers(
    id: string,
    data: UserFollowInputModel
  ): Promise<ConnectionModel<FollowModel>> {
    const userRepository = new UserRepository();
    const followers = await userRepository.followers(id, data);
    return followers;
  }

  async following(
    id: string,
    data: UserFollowInputModel
  ): Promise<ConnectionModel<FollowModel>> {
    const userRepository = new UserRepository();
    const following = await userRepository.following(id, data);
    return following;
  }

  async follow(fromUserId: string, toUserId: string): Promise<boolean> {
    const userRepository = new UserRepository();
    const success = await userRepository.follow(fromUserId, toUserId);

    return success;
  }

  async unfollow(fromUserId: string, toUserId: string): Promise<boolean> {
    const userRepository = new UserRepository();
    const success = await userRepository.unfollow(fromUserId, toUserId);

    return success;
  }

  async countFollowers(id: string): Promise<number> {
    const userRepository = new UserRepository();
    const count = await userRepository.countFollowers(id);
    return count;
  }

  async countFollowing(id: string): Promise<number> {
    const userRepository = new UserRepository();
    const count = await userRepository.countFollowing(id);
    return count;
  }

  async followerByCurrentUser(
    id: string,
    currentUserId: string
  ): Promise<boolean> {
    const userRepository = new UserRepository();
    return await userRepository.followerByCurrentUser(id, currentUserId);
  }

  async followingByCurrentUser(
    id: string,
    currentUserId: string
  ): Promise<boolean> {
    const userRepository = new UserRepository();
    return await userRepository.followingByCurrentUser(id, currentUserId);
  }

  async uploadAvatar(id: string, file: File): Promise<string> {
    const fileSplit = file.name.split(".");
    const fileExtension = fileSplit[fileSplit.length - 1];
    const avatarPath = `avatars/avatar-${id}-${new Date().getTime()}.${fileExtension}`;
    const avatarFullPath = `${Environment.get(
      "AWS_S3_BUCKET_URL"
    )}/${avatarPath}`;
    const upload = {
      Bucket: `${Environment.get("AWS_S3_BUCKET")}`,
      Key: avatarPath,
      Body: Buffer.from(await file.arrayBuffer()),
    };
    await s3.send(new PutObjectCommand(upload));
    const userRepository = new UserRepository();

    await userRepository.uploadAvatar(id, avatarFullPath);
    return avatarFullPath;
  }
}
