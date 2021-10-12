/* eslint-disable camelcase */
import { model, Schema } from "mongoose";

import { ServerConfig } from "../../interfaces/database/ServerConfig";

export const ServerConfigSchema = new Schema({
  serverID: String,
  serverName: String,
  thanks: String,
  levels: String,
  welcome_channel: String,
  level_channel: String,
  suggestion_channel: {
    type: String,
    default: "",
  },
  muted_role: String,
  custom_welcome: String,
  hearts: [String],
  blocked: [String],
  self_roles: [String],
  automod_channels: [String],
  no_automod_channels: [String],
  automod_roles: [String],
  allowed_links: [String],
  link_message: String,
  level_roles: [Object],
  join_role: String,
  leave_message: String,
  report_channel: String,
  level_ignore: [String],
  sass_mode: String,
  message_events: String,
  voice_events: String,
  thread_events: String,
  moderation_events: String,
  member_events: String,
});

export default model<ServerConfig>("server", ServerConfigSchema);
