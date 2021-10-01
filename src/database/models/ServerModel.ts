/* eslint-disable camelcase */
import { Document, model, Schema } from "mongoose";

import { LevelRoleInt } from "../../interfaces/settings/LevelRoleInt";

export interface ServerModelInt extends Document {
  serverID: string;
  serverName: string;
  thanks: string;
  levels: string;
  welcome_channel: string;
  log_channel: string;
  level_channel: string;
  suggestion_channel: string;
  ticket_category: string;
  ticket_role: string;
  muted_role: string;
  custom_welcome: string;
  hearts: string[];
  blocked: string[];
  self_roles: string[];
  anti_links: string[];
  permit_links: string[];
  link_roles: string[];
  allowed_links: string[];
  link_message: string;
  level_roles: LevelRoleInt[];
  join_role: string;
  leave_message: string;
  report_channel: string;
  level_ignore: string[];
}

export const Server = new Schema({
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
  ticket_category: string,
  ticket_role: string,
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
});

export default model<ServerModelInt>("server", Server);
