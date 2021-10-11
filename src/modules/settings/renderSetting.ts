import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { LevelRole } from "../../interfaces/settings/LevelRole";
import { Settings } from "../../interfaces/settings/Settings";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Renders a server setting's value into a string in the format that Discord
 * expects - allows for clean formatting of roles and channels.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {Settings} key The setting to render.
 * @param {string | LevelRole} value That setting's value.
 * @returns {string} The parsed value.
 */
export const renderSetting = (
  Becca: BeccaLyria,
  key: Settings,
  value: string | LevelRole
): string => {
  try {
    if (!value) {
      return "No value set.";
    }
    switch (key) {
      case "thanks":
      case "levels":
      case "custom_welcome":
      case "allowed_links":
      case "link_message":
      case "leave_message":
      case "sass_mode":
        return value as string;
      case "welcome_channel":
      case "level_channel":
      case "message_events":
      case "voice_events":
      case "moderation_events":
      case "thread_events":
      case "member_events":
      case "suggestion_channel":
      case "report_channel":
      case "level_ignore":
        return `<#${value}>`;
      case "hearts":
      case "blocked":
        return `<@!${value}>`;
      case "self_roles":
      case "automod_roles":
      case "muted_role":
      case "join_role":
        return `<@&${value}>`;
      case "anti_links":
      case "permit_links":
        return value === "all" ? value : `<#${value}>`;
      case "level_roles":
        return `<@&${(value as LevelRole).role}> at level ${
          (value as LevelRole).level
        }`;
      default:
        return "Something went wrong with rendering this setting.";
    }
  } catch (err) {
    beccaErrorHandler(Becca, "render setting module", err);
    return "Something went wrong with rendering this setting.";
  }
};
