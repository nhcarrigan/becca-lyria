/* eslint-disable camelcase */
import { LevelRoleInt } from "../../interfaces/settings/LevelRoleInt";

/**
 * This config maps the default values for the ServerModel document. Useful
 * for the reset command as well as instantiating new server settings.
 */
export const defaultServer = {
  thanks: "off",
  levels: "off",
  welcome_channel: "",
  log_channel: "",
  level_channel: "",
  suggestion_channel: "",
  muted_role: "",
  custom_welcome:
    "Hello {@username}! Welcome to {@servername}! My name is Becca. Feel free to let me know if you need anything.",
  hearts: [] as string[],
  blocked: [] as string[],
  self_roles: [] as string[],
  anti_links: [] as string[],
  permit_links: [] as string[],
  link_roles: [] as string[],
  allowed_links: [] as string[],
  link_message:
    "{@username}, it seems you are not allowed to send links in this channel.",
  level_roles: [] as LevelRoleInt[],
  join_role: "",
  leave_message:
    "{@username}, thank you for your time in {@servername}. Your contributions are appreciated.",
  report_channel: "",
  level_ignore: [] as string[],
  sass_mode: "off",
};
