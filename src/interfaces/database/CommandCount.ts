import { Document } from "mongoose";

export interface CommandCount extends Document {
  serverId: string;
  serverName: string;
  commandUses: number;
}

export const testCommandCount: Omit<CommandCount, keyof Document> = {
  serverId: "test",
  serverName: "test",
  commandUses: 0,
};
