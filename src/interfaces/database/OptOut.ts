import { Document } from "mongoose";

export interface OptOut extends Document {
  userId: string;
  activity: boolean;
  currency: boolean;
  emote: boolean;
  level: boolean;
  star: boolean;
  vote: boolean;
}

export const testOptOut: Omit<OptOut, keyof Document> = {
  userId: "test",
  activity: false,
  currency: false,
  emote: false,
  level: false,
  star: false,
  vote: false,
};
