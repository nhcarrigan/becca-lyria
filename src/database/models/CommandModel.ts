import { Document, model, Schema } from "mongoose";

export interface CommandInt extends Document {
  serviceId: string;
  serverName: string;
  commandUses: number;
  // TODO: should keep track of the command used maybe?
}

export const Command = new Schema({
  serverId: String,
  serverName: String,
  commandUses: Number,
});

export default model<CommandInt>("command", Command);
