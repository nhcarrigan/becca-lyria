import { Document } from "mongoose";

export interface Level extends Document {
  serverID: string;
  serverName: string;
  userID: string;
  userTag: string;
  avatar: string;
  points: number;
  level: number;
  lastSeen: Date;
  cooldown: number;
}

export const testLevel: Omit<Level, keyof Document> = {
  serverID: "test",
  serverName: "test",
  userID: "test",
  userTag: "test",
  avatar: "test",
  points: 0,
  level: 0,
  lastSeen: new Date(),
  cooldown: 0,
};
