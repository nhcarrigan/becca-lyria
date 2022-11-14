import { model, Schema } from "mongoose";

import { Poll } from "../../interfaces/database/Poll";

export const PollSchema = new Schema({
  serverId: String,
  channelId: String,
  messageId: String,
  results: Object,
  responses: Array,
  endsAt: Number,
});

export default model<Poll>("poll", PollSchema);
