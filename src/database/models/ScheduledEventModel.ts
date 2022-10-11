import { model, Schema } from "mongoose";

import { ScheduledEvent } from "../../interfaces/database/ScheduledEvent";

export const ScheduledEventSchema = new Schema<ScheduledEvent>({
  member: String,
  time: Number,
  targetChannel: String,
  lang: String,
  message: String,
});

export default model<ScheduledEvent>("ScheduledEvent", ScheduledEventSchema);
