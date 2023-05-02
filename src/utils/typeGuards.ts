import { EmoteAction } from "../config/commands/emoteData";
import { ModerationActions } from "../interfaces/commands/moderation/ModerationActions";
import {
  ArrayOfChannelIdSettings,
  ArrayOfLevelRoleSettings,
  ArrayOfRoleIdSettings,
  ArrayOfTriggerSettings,
  ArrayOfUserIdSettings,
  ChannelIdSettings,
  RoleIdSettings,
  StringSettings,
} from "../interfaces/settings/Settings";

/**
 * Confirms that a string is a valid moderation action.
 *
 * @param {string} action The string to test.
 * @returns {boolean} If the string matches the ModerationActions type.
 */
export const isModerationAction = (
  action: string
): action is ModerationActions => {
  const actions: { [key in ModerationActions]: string } = {
    ban: "ban",
    kick: "kick",
    mute: "mute",
    unban: "unban",
    unmute: "unmute",
    warn: "warn",
  };
  return Object.keys(actions).includes(action);
};

/**
 * Confirms that az string is a valid emote action.
 *
 * @param {string} emote The string to test.
 * @returns {boolean} If the string matches the EmoteAction type.
 */
export const isEmoteAction = (emote: string): emote is EmoteAction => {
  const actions: { [key in EmoteAction]: string } = {
    hug: "hug",
    kiss: "kiss",
    smack: "smack",
    boop: "boop",
    throw: "throw",
    pat: "pat",
    uwu: "uwu",
  };
  return Object.keys(actions).includes(emote);
};

/**
 * Confirms that a string is a valid antiphish setting.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is one of "none" | "mute" | "kick" | "ban".
 */
export const isAntiphishSetting = (
  setting: string
): setting is "none" | "mute" | "kick" | "ban" => {
  return ["none", "mute", "kick", "ban"].includes(setting);
};

/**
 * Confirms that a string is a valid style setting.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is one of "embed" | "text".
 */
export const isStyleSetting = (
  setting: string
): setting is "embed" | "text" => {
  return ["embed", "text"].includes(setting);
};

/**
 * Confirms that a string is a valid string value setting.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is a string value in the database.
 */
export const isStringSetting = (setting: string): setting is StringSettings => {
  // turn this array into object map
  const obj: { [key in StringSettings]: string } = {
    levels: "levels",
    custom_welcome: "custom_welcome",
    link_message: "link_message",
    leave_message: "leave_message",
    sass_mode: "sass_mode",
    links: "links",
    profanity: "profanity",
    profanity_message: "profanity_message",
    appeal_link: "appeal_link",
    initial_xp: "initial_xp",
    level_style: "level_style",
    level_message: "level_message",
    role_message: "role_message",
    welcome_style: "welcome_style",
    starboard_emote: "starboard_emote",
  };
  return Object.keys(obj).includes(setting);
};

/**
 * Confirms that a string is a valid channel ID value setting.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is a channel ID value in the database.
 */
export const isChannelIdSetting = (
  setting: string
): setting is ChannelIdSettings => {
  const obj: { [key in ChannelIdSettings]: string } = {
    welcome_channel: "welcome_channel",
    depart_channel: "depart_channel",
    level_channel: "level_channel",
    suggestion_channel: "suggestion_channel",
    report_channel: "report_channel",
    message_events: "message_events",
    voice_events: "voice_events",
    thread_events: "thread_events",
    moderation_events: "moderation_events",
    member_events: "member_events",
    ticket_category: "ticket_category",
    ticket_log_channel: "ticket_log_channel",
    starboard_channel: "starboard_channel",
  };
  return Object.keys(obj).includes(setting);
};

/**
 * Confirms that a string is a valid role ID value setting.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is a role ID value in the database.
 */
export const isRoleIdSetting = (setting: string): setting is RoleIdSettings => {
  const obj: { [key in RoleIdSettings]: string } = {
    join_role: "join_role",
    ticket_role: "ticket_role",
  };
  return Object.keys(obj).includes(setting);
};

/**
 * Confirms that a string is a valid user ID array value setting.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is a user ID array value in the database.
 */
export const isUserIdArraySetting = (
  setting: string
): setting is ArrayOfUserIdSettings => {
  const obj: { [key in ArrayOfUserIdSettings]: string } = {
    blocked: "blocked",
    hearts: "hearts",
  };
  return Object.keys(obj).includes(setting);
};

/**
 * Confirms that a string is a valid channel ID array value setting.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is a channel ID array value in the database.
 */
export const isChannelIdArraySetting = (
  setting: string
): setting is ArrayOfChannelIdSettings => {
  const obj: { [key in ArrayOfChannelIdSettings]: string } = {
    automod_channels: "automod_channels",
    emote_channels: "emote_channels",
    level_ignore: "level_ignore",
    no_automod_channels: "no_automod_channels",
  };
  return Object.keys(obj).includes(setting);
};

/**
 * Confirms that a string is a valid role ID array value setting.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is a role ID array value in the database.
 */
export const isRoleIdArraySetting = (
  setting: string
): setting is ArrayOfRoleIdSettings => {
  const obj: { [key in ArrayOfRoleIdSettings]: string } = {
    automod_roles: "automod_roles",
  };
  return Object.keys(obj).includes(setting);
};

/**
 * Confirms that a string is a valid level role array value setting.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is a level role array value in the database.
 */
export const isLevelRoleArraySetting = (
  setting: string
): setting is ArrayOfLevelRoleSettings => {
  const obj: { [key in ArrayOfLevelRoleSettings]: string } = {
    level_roles: "level_roles",
  };
  return Object.keys(obj).includes(setting);
};

/**
 * Confirms that a string is a valid trigger array value setting.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is a trigger array value in the database.
 */
export const isTriggerArraySetting = (
  setting: string
): setting is ArrayOfTriggerSettings => {
  const obj: { [key in ArrayOfTriggerSettings]: string } = {
    new_triggers: "new_triggers",
  };
  return Object.keys(obj).includes(setting);
};
