import { Document, model, Schema } from "mongoose";

interface OldLevel extends Document {
  serverID: string;
  serverName: string;
  users: {
    userID: string;
    userTag: string;
    avatar: string;
    points: number;
    level: number;
    lastSeen: Date;
    cooldown: number;
  }[];
}

const oldlevelschema = new Schema({
  serverID: String,
  serverName: String,
  users: [],
});

export default model<OldLevel>("level", oldlevelschema);
