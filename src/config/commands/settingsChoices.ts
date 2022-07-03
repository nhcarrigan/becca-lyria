import { APIApplicationCommandOptionChoice } from "discord-api-types/v10";

import { ArraySettings } from "../../interfaces/settings/ArraySettings";
import {
  AutomodSettings,
  AutomodToggleSettings,
} from "../../interfaces/settings/AutomodSettings";
import { LogSettings } from "../../interfaces/settings/LogSettings";
import { Settings } from "../../interfaces/settings/Settings";

export const configChoices: APIApplicationCommandOptionChoice<Settings>[] = [
  { name: "Level System", value: "levels" },
  { name: "Welcome Message Channel", value: "welcome_channel" },
  { name: "Departure Message Channel", value: "depart_channel" },
  { name: "Level Log Channel", value: "level_channel" },
  { name: "Suggestion Channel", value: "suggestion_channel" },
  { name: "Custom Welcome Message", value: "custom_welcome" },
  { name: "Heart Users", value: "hearts" },
  { name: "Blocked Users", value: "blocked" },
  { name: "Level-assigned Roles", value: "level_roles" },
  { name: "Role on Join", value: "join_role" },
  { name: "Custom Leave Message", value: "leave_message" },
  { name: "Report Channel", value: "report_channel" },
  { name: "No Levelling Channels", value: "level_ignore" },
  { name: "Ban Appeal Link", value: "appeal_link" },
  { name: "Sass Mode", value: "sass_mode" },
  { name: "Emote-Only Channels", value: "emote_channels" },
  { name: "Initial Experience", value: "initial_xp" },
];

export const configViewChoices: APIApplicationCommandOptionChoice<
  ArraySettings | "global"
>[] = [
  { name: "Global Settings", value: "global" },
  // global must be on top for tests to pass
  { name: "Heart Users", value: "hearts" },
  { name: "Blocked Users", value: "blocked" },
  { name: "Level-assigned Roles", value: "level_roles" },
  { name: "No Levelling Channels", value: "level_ignore" },
  { name: "Emote-Only Channels", value: "emote_channels" },
];

export const logChoices: APIApplicationCommandOptionChoice<LogSettings>[] = [
  { name: "Message Events (edit, delete)", value: "message_events" },
  {
    name: "Voice Events (join, disconnect, mute, deafen)",
    value: "voice_events",
  },
  { name: "Thread Events (create, archive, delete)", value: "thread_events" },
  { name: "Moderation Activity (kick, ban, mute)", value: "moderation_events" },
  { name: "Member Events (screening, updates)", value: "member_events" },
];

export const automodChoices: APIApplicationCommandOptionChoice<AutomodSettings>[] =
  [
    { name: "Automodded Channels", value: "automod_channels" },
    { name: "Automod Ignored Channels", value: "no_automod_channels" },
    { name: "Automod Exempt Roles", value: "automod_roles" },
    { name: "Allowed Link Regex", value: "allowed_links" },
    { name: "Link Delete Message", value: "link_message" },
    { name: "Profanity Delete Message", value: "profanity_message" },
  ];

export const automodViewChoices: APIApplicationCommandOptionChoice<
  ArraySettings | "global"
>[] = [
  { name: "Global Settings", value: "global" },
  // global must be on top for tests to pass
  { name: "Automodded Channels", value: "automod_channels" },
  { name: "Automod Ignored Channels", value: "no_automod_channels" },
  { name: "Automod Exempt Roles", value: "automod_roles" },
  { name: "Allowed Link Regex", value: "allowed_links" },
];

export const automodToggleChoices: APIApplicationCommandOptionChoice<AutomodToggleSettings>[] =
  [
    { name: "Link Detection", value: "links" },
    { name: "Profanity Detection", value: "profanity" },
  ];

export const automodAntiphishChoices: APIApplicationCommandOptionChoice<
  "none" | "mute" | "kick" | "ban"
>[] = [
  { name: "Do nothing when a scam link is detected.", value: "none" },
  { name: "Mute the user for 24 hours.", value: "mute" },
  { name: "Kick the user.", value: "kick" },
  { name: "Ban the user.", value: "ban" },
];
