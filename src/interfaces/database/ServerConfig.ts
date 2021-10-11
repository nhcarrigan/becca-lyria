/* eslint-disable camelcase */
import { Document } from "mongoose";

import { LevelRole } from "../settings/LevelRole";

export interface ServerConfig extends Document {
  serverID: string;
  serverName: string;
  thanks: string;
  levels: string;
  welcome_channel: string;
  level_channel: string;
  suggestion_channel: string;
  muted_role: string;
  custom_welcome: string;
  hearts: string[];
  blocked: string[];
  self_roles: string[];
  anti_links: string[];
  permit_links: string[];
  automod_roles: string[];
  allowed_links: string[];
  link_message: string;
  level_roles: LevelRole[];
  join_role: string;
  leave_message: string;
  report_channel: string;
  level_ignore: string[];
  sass_mode: string;
  message_events: string;
  voice_events: string;
  thread_events: string;
  moderation_events: string;
  member_events: string;
}

export const testServerConfig: Omit<ServerConfig, keyof Document> = {
  serverID: "",
  serverName: "",
  thanks: "",
  levels: "",
  welcome_channel: "",
  level_channel: "",
  suggestion_channel: "",
  muted_role: "",
  custom_welcome: "",
  hearts: [],
  blocked: [],
  self_roles: [],
  anti_links: [],
  permit_links: [],
  automod_roles: [],
  allowed_links: [],
  link_message: "",
  level_roles: [],
  join_role: "",
  leave_message: "",
  report_channel: "",
  level_ignore: [],
  sass_mode: "",
  message_events: "",
  voice_events: "",
  thread_events: "",
  moderation_events: "",
  member_events: "",
};
