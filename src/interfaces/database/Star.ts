import { Document } from "mongoose";

export interface Star extends Document {
  serverID: string;
  serverName: string;
  users: {
    userID: string;
    userTag: string;
    avatar: string;
    stars: number;
  }[];
}

export const testStar: Omit<Star, keyof Document> = {
  serverID: "123456789",
  serverName: "Test Server",
  users: [],
};
