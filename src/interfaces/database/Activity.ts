import { Document } from "mongoose";

export interface Activity extends Document {
  userId: string;
  buttons: number;
  commands: number;
  selects: number;
  contexts: number;
}

export const testActivity: Omit<Activity, keyof Document> = {
  userId: "test",
  buttons: 0,
  commands: 0,
  selects: 0,
  contexts: 0,
};
