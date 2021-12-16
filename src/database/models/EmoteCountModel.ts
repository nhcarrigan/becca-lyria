import { model, Schema } from "mongoose";

import { EmoteCount } from "../../interfaces/database/EmoteCount";

export const EmoteCountSchema = new Schema({
  userId: String,
  userName: String,
  avatar: String,
  hug: Number,
  kiss: Number,
  pat: Number,
  smack: Number,
  boop: Number,
  throw: Number,
  uwu: Number,
});

export default model<EmoteCount>("EmoteCount", EmoteCountSchema);
