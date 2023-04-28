/**
 * Type definition for available guild setting names. This should be updated if
 * settings are added or removed.
 */
export type Settings =
  | ArrayOfIdSettings
  | ArrayOfStringSettings
  | ArrayOfLevelRoleSettings
  | ArrayOfTriggerSettings
  | StringSettings
  | NumberSettings
  | AntiphishSettings
  | StyleSettings
  | IdSettings;

export type ArrayOfIdSettings =
  | "automod_channels"
  | "automod_roles"
  | "emote_channels"
  | "level_ignore"
  | "hearts"
  | "blocked"
  | "no_automod_channels";

export type ArrayOfStringSettings = "allowed_links";

export type ArrayOfLevelRoleSettings = "level_roles";

export type ArrayOfTriggerSettings = "new_triggers";

export type StringSettings =
  | "custom_welcome"
  | "levels"
  | "link_message"
  | "leave_message"
  | "sass_mode"
  | "links"
  | "profanity"
  | "profanity_message"
  | "appeal_link"
  | "initial_xp"
  | "level_message"
  | "role_message"
  | "starboard_emote";

export type NumberSettings = "starboard_threshold" | "level_decay";

export type AntiphishSettings = "antiphish";

export type StyleSettings = "level_style" | "welcome_style";

export type IdSettings =
  | "welcome_channel"
  | "depart_channel"
  | "message_events"
  | "voice_events"
  | "thread_events"
  | "moderation_events"
  | "member_events"
  | "level_channel"
  | "suggestion_channel"
  | "join_role"
  | "report_channel"
  | "ticket_category"
  | "ticket_log_channel"
  | "ticket_role"
  | "starboard_channel";
