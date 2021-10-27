import { Document } from "mongoose";

export interface EmoteCount extends Document {
  userId: string;
  userName: string;
  avatar: string;
  hug: number;
  kiss: number;
  pat: number;
  smack: number;
  boop: number;
  throw: number;
  uwu: number;
}

export const testEmoteCount: Omit<EmoteCount, keyof Document> = {
  userId: "123456789",
  userName: "Test User",
  avatar: "hi",
  hug: 0,
  kiss: 0,
  pat: 0,
  smack: 0,
  boop: 0,
  throw: 0,
  uwu: 0,
};
