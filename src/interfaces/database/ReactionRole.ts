import { Document } from "mongoose";

export interface ReactionRole extends Document {
  serverId: string;
  serverName: string;
  channelId: string;
  messageId: string;
  emoji: string;
  roleId: string;
}

export const testReactionRole: Omit<ReactionRole, keyof Document> = {
  serverId: "123456789",
  serverName: "Test Server",
  channelId: "123456789",
  messageId: "123456789",
  emoji: "🎉",
  roleId: "123456789",
};
