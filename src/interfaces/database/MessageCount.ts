import { Document } from "mongoose";

export interface MessageCount extends Document {
  serverId: string;
  userId: string;
  messages: number;
}

export const testMessageCount: Omit<MessageCount, keyof Document> = {
  serverId: "test",
  userId: "test",
  messages: 0,
};
