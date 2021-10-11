import { model, Schema } from "mongoose";

import { Level } from "../../interfaces/database/Level";

export const LevelSchema = new Schema({
  serverID: String,
  serverName: String,
  users: [],
});

export default model<Level>("level", LevelSchema);
