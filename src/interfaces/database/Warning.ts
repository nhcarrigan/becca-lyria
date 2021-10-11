import { Document } from "mongoose";

export interface Warning extends Document {
  serverID: string;
  serverName: string;
  users: {
    userID: string;
    userName: string;
    lastWarnText: string;
    lastWarnDate: number;
    warnCount: number;
  }[];
}

export const testWarning: Omit<Warning, keyof Document> = {
  serverID: "123",
  serverName: "test",
  users: [],
};
