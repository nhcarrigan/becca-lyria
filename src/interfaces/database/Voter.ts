import { Document } from "mongoose";

export interface Voter extends Document {
  userId: string;
  serverVotes: number;
  botVotes: number;
  activeMonth: number;
  monthlyVotes: number;
}

export const testVoter: Omit<Voter, keyof Document> = {
  userId: "test",
  serverVotes: 0,
  botVotes: 0,
  activeMonth: 0,
  monthlyVotes: 0,
};
