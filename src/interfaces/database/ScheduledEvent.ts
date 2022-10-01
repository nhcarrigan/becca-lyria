import { Document } from "mongoose";

export interface RawScheduledEvent {
  member: string;
  time: number;
  targetChannel: string;
  lang: string;
  message: string;
}

export type ScheduledEvent = RawScheduledEvent & Document;

export const testSchedule: Omit<ScheduledEvent, keyof Document> = {
  member: "716707753090875473",
  time: 0,
  targetChannel: "876897718876905512",
  lang: "en-GB",
  message: "Sup, nerds?",
};
