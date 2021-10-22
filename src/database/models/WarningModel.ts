import { model, Schema } from "mongoose";

import { Warning } from "../../interfaces/database/Warning";

export const WarningSchema = new Schema({
  serverID: String,
  serverName: String,
  users: [],
});

export default model<Warning>("warning", WarningSchema);
