import { model, Schema } from "mongoose";

import { Level } from "../../interfaces/database/Level";

export const LevelSchema = new Schema({
  serverID: String,
  serverName: String,
  userID: String,
  userTag: String,
  avatar: String,
  points: Number,
  level: Number,
  lastSeen: Date,
  cooldown: Number,
});

export default model<Level>("newLevel", LevelSchema);
