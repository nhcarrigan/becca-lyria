import { Document, model, Schema } from "mongoose";

export interface CommandInt extends Document {
  serverId: string;
  serverName: string;
  commandUses: number;
}

export const Command = new Schema({
  serverId: String,
  serverName: String,
  commandUses: Number,
});

export default model<CommandInt>("command", Command);
