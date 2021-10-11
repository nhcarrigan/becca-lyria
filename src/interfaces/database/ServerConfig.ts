/* eslint-disable camelcase */
import { Document } from "mongoose";

import { LevelRole } from "../settings/LevelRole";

export interface ServerConfig extends Document {
  serverID: string;
  serverName: string;
  thanks: string;
  levels: string;
  welcome_channel: string;
  log_channel: string;
  level_channel: string;
  suggestion_channel: string;
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
  level_roles: LevelRole[];
  join_role: string;
  leave_message: string;
  report_channel: string;
  level_ignore: string[];
  sass_mode: string;
}

export const testServerConfig: Omit<ServerConfig, keyof Document> = {
  serverID: "",
  serverName: "",
  thanks: "",
  levels: "",
  welcome_channel: "",
  log_channel: "",
  level_channel: "",
  suggestion_channel: "",
  muted_role: "",
  custom_welcome: "",
  hearts: [],
  blocked: [],
  self_roles: [],
  anti_links: [],
  permit_links: [],
  link_roles: [],
  allowed_links: [],
  link_message: "",
  level_roles: [],
  join_role: "",
  leave_message: "",
  report_channel: "",
  level_ignore: [],
  sass_mode: "",
};
