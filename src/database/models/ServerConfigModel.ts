/* eslint-disable camelcase */
import { model, Schema } from "mongoose";

import { ServerConfig } from "../../interfaces/database/ServerConfig";

export const ServerConfigSchema = new Schema({
  serverID: String,
  serverName: String,
  thanks: String,
  levels: String,
  welcome_channel: String,
  log_channel: String,
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
  anti_links: [String],
  permit_links: [String],
  link_roles: [String],
  allowed_links: [String],
  link_message: String,
  level_roles: [Object],
  join_role: String,
  leave_message: String,
  report_channel: String,
  level_ignore: [String],
  sass_mode: String,
});

export default model<ServerConfig>("server", ServerConfigSchema);
