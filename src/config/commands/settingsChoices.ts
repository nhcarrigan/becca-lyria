import { ArraySettings } from "../../interfaces/settings/ArraySettings";
import { LogSettings } from "../../interfaces/settings/LogSettings";
import { Settings } from "../../interfaces/settings/Settings";

export const configChoices: [string, Settings][] = [
  ["Thanks System", "thanks"],
  ["Level System", "levels"],
  ["Join/Leave Channel", "welcome_channel"],
  ["Level Log Channel", "level_channel"],
  ["Suggestion Channel", "suggestion_channel"],
  ["Muted Role", "muted_role"],
  ["Custom Welcome Message", "custom_welcome"],
  ["Heart Users", "hearts"],
  ["Blocked Users", "blocked"],
  ["Self-assignable Roles", "self_roles"],
  ["Anti-link Channels", "anti_links"],
  ["Allowed Link Channels", "permit_links"],
  ["Allowed Link Roles", "automod_roles"],
  ["Allowed Link Regex", "allowed_links"],
  ["Link Delete Message", "link_message"],
  ["Level-assigned Roles", "level_roles"],
  ["Role on Join", "join_role"],
  ["Custom Leave Message", "leave_message"],
  ["Report Channel", "report_channel"],
  ["No Levelling Channels", "level_ignore"],
  ["Sass Mode", "sass_mode"],
];

export const configViewChoices: [string, ArraySettings | "global"][] = [
  ["Global Settings", "global"],
  // global must be on top for tests to pass
  ["Heart Users", "hearts"],
  ["Self-Assignable Roles", "self_roles"],
  ["Blocked Users", "blocked"],
  ["Anti-link Channels", "anti_links"],
  ["Allowed Link Channels", "permit_links"],
  ["Allowed Link Roles", "automod_roles"],
  ["Allowed Link Regex", "allowed_links"],
  ["Level-assigned Roles", "level_roles"],
  ["No Levelling Channels", "level_ignore"],
];

export const logChoices: [string, LogSettings][] = [
  ["Message Events (edit, delete)", "message_events"],
  ["Voice Events (join, disconnect, mute, deafen)", "voice_events"],
  ["Thread Events (create, archive, delete)", "thread_events"],
  ["Moderation Activity (kick, ban, mute)", "moderation_events"],
  ["Member Events (screening, updates)", "member_events"],
];
