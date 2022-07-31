import { model, Schema } from "mongoose";

import { OptOut } from "../../interfaces/database/OptOut";

export const OptOutSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  activity: Boolean,
  currency: Boolean,
  emote: Boolean,
  level: Boolean,
  star: Boolean,
  vote: Boolean,
});

export default model<OptOut>("optout", OptOutSchema);
