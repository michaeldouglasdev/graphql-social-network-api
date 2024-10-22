import { Environment } from "@core/environment";
import jwt from "jsonwebtoken";
import { UserModel } from "@users/models/user.model";

export class JwtService {
  static sign(user: UserModel): string {
    const accessToken = jwt.sign(user, Environment.get("JWT_PRIVATE_KEY"));
    return accessToken;
  }

  static decode(accessToken: string): UserModel {
    const token = accessToken.split("Bearer ")?.[1];
    const decoded = jwt.verify(
      token,
      Environment.get("JWT_PRIVATE_KEY")
    ) as UserModel;
    return decoded;
  }
}
