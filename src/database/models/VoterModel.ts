import { model, Schema } from "mongoose";

import { Voter } from "../../interfaces/database/Voter";

export const VoterSchema = new Schema({
  userId: String,
  serverVotes: Number,
  botVotes: Number,
});

export default model<Voter>("voter", VoterSchema);
