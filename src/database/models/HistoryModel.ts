import { model, Schema } from "mongoose";

import { History } from "../../interfaces/database/History";

export const HistorySchema = new Schema({
  serverId: String,
  userId: String,
  bans: Number,
  kicks: Number,
  mutes: Number,
  unbans: {
    type: Number,
    default: 0,
  },
  unmutes: Number,
  warns: Number,
});

export default model<History>("history", HistorySchema);
