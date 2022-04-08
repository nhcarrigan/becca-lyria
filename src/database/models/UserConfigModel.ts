import { model, Schema } from "mongoose";

import { UserConfig } from "../../interfaces/database/UserConfig";

export const UserConfigSchema = new Schema({
  userId: String,
  levelcard: Object,
});

export default model<UserConfig>("userconfig", UserConfigSchema);
