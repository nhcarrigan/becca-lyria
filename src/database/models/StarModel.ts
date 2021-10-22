import { model, Schema } from "mongoose";

import { Star } from "../../interfaces/database/Star";

export const StarSchema = new Schema({
  serverID: String,
  serverName: String,
  users: [],
});

export default model<Star>("StarCount", StarSchema);
