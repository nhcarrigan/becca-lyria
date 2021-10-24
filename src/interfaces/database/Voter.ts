import { Document } from "mongoose";

export interface Voter extends Document {
  userId: string;
  serverVotes: number;
  botVotes: number;
}

export const testVoter: Omit<Voter, keyof Document> = {
  userId: "test",
  serverVotes: 0,
  botVotes: 0,
};
