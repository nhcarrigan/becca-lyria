import { model, Schema } from "mongoose";

import { Activity } from "../../interfaces/database/Activity";

export const ActivitySchema = new Schema<Activity>({
  userId: String,
  buttons: Number,
  commands: Number,
  selects: Number,
  contexts: Number,
});

export default model<Activity>("activity", ActivitySchema);
