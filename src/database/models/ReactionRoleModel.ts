import { model, Schema } from "mongoose";

import { ReactionRole } from "../../interfaces/database/ReactionRole";

export const ReactionRoleSchema = new Schema({
  serverId: String,
  serverName: String,
  channelId: String,
  messageId: String,
  emoji: String,
  roleId: String,
});

export default model<ReactionRole>("ReactionRole", ReactionRoleSchema);
