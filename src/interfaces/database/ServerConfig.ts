/* eslint-disable camelcase */
import { Document } from "mongoose";

import { LevelRole } from "../settings/LevelRole";
import { Trigger } from "../settings/Trigger";

export interface ServerConfig extends Document {
  serverID: string;
  serverName: string;
  levels: string;
  welcome_channel: string;
  depart_channel: string;
  level_channel: string;
  suggestion_channel: string;
  custom_welcome: string;
  hearts: string[];
  blocked: string[];
  triggers: [string, string][];
  newTriggers: Trigger[];
  automod_channels: string[];
  no_automod_channels: string[];
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
  links: string;
  profanity: string;
  profanity_message: string;
  emote_channels: string[];
  appeal_link: string;
  antiphish: "none" | "mute" | "kick" | "ban";
  initial_xp: string;
  level_style: "embed" | "text";
  level_message: string;
  role_message: string;
  welcome_style: "embed" | "text";
  ticket_category: string;
  ticket_log_channel: string;
  ticket_role: string;
  starboard_emote: string;
  starboard_channel: string;
  starboard_threshold: string;
  level_decay: string;
}

export const testServerConfig: Omit<ServerConfig, keyof Document> = {
  serverID: "",
  serverName: "",
  levels: "",
  welcome_channel: "",
  depart_channel: "",
  level_channel: "",
  suggestion_channel: "",
  custom_welcome: "",
  hearts: [],
  blocked: [],
  triggers: [],
  newTriggers: [],
  automod_channels: [],
  no_automod_channels: [],
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
  links: "",
  profanity: "",
  profanity_message: "",
  emote_channels: [],
  appeal_link: "",
  antiphish: "none",
  initial_xp: "0",
  level_message: "",
  level_style: "embed",
  role_message: "",
  welcome_style: "embed",
  ticket_category: "",
  ticket_log_channel: "",
  ticket_role: "",
  starboard_emote: "",
  starboard_channel: "",
  starboard_threshold: "5",
  level_decay: "0",
};
