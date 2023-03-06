import { model, Schema } from "mongoose";

import { MessageCount } from "../../interfaces/database/MessageCount";

export const MessageCountSchema = new Schema({
  serverId: String,
  userId: String,
  messages: Number,
});

export default model<MessageCount>("messageCount", MessageCountSchema);
