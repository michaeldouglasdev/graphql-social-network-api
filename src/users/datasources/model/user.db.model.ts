export interface FollowUserDB {
  id: string;
  name: string;
  username: string;
  role: string;
  email: string;
}
export interface FollowerDB {
  id: string;
  follower: FollowUserDB;
}

export interface FollowingDB {
  id: string;
  following: FollowUserDB;
}
