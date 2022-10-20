import { Document } from "mongoose";

export interface ScheduledEvent extends Document {
  member: string;
  time: number;
  targetChannel: string;
  lang: string;
  message: string;
}

export const testSchedule: Omit<ScheduledEvent, keyof Document> = {
  member: "716707753090875473",
  time: 0,
  targetChannel: "876897718876905512",
  lang: "en-GB",
  message: "Sup, nerds?",
};
