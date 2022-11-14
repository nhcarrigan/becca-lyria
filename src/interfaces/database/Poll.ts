import { Document } from "mongoose";

export interface Poll extends Document {
  serverId: string;
  channelId: string;
  messageId: string;
  results: {
    a: number;
    b: number;
    c: number;
    d: number;
  };
  responses: string[];
  endsAt: number;
}

export const testPoll: Omit<Poll, keyof Document> = {
  serverId: "123",
  channelId: "123",
  messageId: "123",
  results: {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
  },
  responses: [],
  endsAt: Date.now(),
};
