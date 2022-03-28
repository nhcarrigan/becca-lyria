import { Document } from "mongoose";

export interface UserConfig extends Document {
  userId: string;
  levelcard: {
    background: string;
    foreground: string;
    progress: string;
  };
}

export const testUsage: Omit<UserConfig, keyof Document> = {
  userId: "12345",
  levelcard: {
    background: "#000000",
    foreground: "#FFFFFF",
    progress: "#FFFFFF",
  },
};
