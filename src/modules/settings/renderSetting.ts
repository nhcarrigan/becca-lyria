import { servers } from "@prisma/client";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { Settings } from "../../interfaces/settings/Settings";
import { Trigger } from "../../interfaces/settings/Trigger";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Renders a server setting's value into a string in the format that Discord
 * expects - allows for clean formatting of roles and channels.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {Settings} key The setting to render.
 * @param {unknown} value That setting's value.
 * @returns {string} The parsed value.
 */
export const renderSetting = (
  Becca: BeccaLyria,
  key: Settings,
  value: unknown
): string => {
  try {
    if (!value) {
      return "No value set.";
    }
    switch (key) {
      case "levels":
      case "custom_welcome":
      case "link_message":
      case "leave_message":
      case "sass_mode":
      case "links":
      case "profanity":
      case "profanity_message":
      case "appeal_link":
      case "antiphish":
      case "initial_xp":
      case "level_style":
      case "level_message":
      case "role_message":
      case "welcome_style":
      case "starboard_emote":
      case "starboard_threshold":
      case "level_decay":
        return `${value}`;
      case "welcome_channel":
      case "depart_channel":
      case "level_channel":
      case "suggestion_channel":
      case "report_channel":
      case "message_events":
      case "voice_events":
      case "thread_events":
      case "moderation_events":
      case "member_events":
      case "ticket_category":
      case "ticket_log_channel":
      case "starboard_channel":
        return `<#${value}>`;
      case "join_role":
      case "ticket_role":
        return `<@&${value}>`;
      case "hearts":
      case "blocked":
        return (value as string[]).map((v) => `<@!${v}>`).join(", ");
      case "new_triggers":
        return (value as Trigger[])
          .map((v) => `${v.trigger} -> ${v.response}`)
          .join(", ");
      case "automod_channels":
      case "no_automod_channels":
      case "level_ignore":
      case "emote_channels":
        return (value as string[]).map((v) => `<#${v}>`).join(", ");
      case "automod_roles":
        return (value as string[]).map((v) => `<@&${v}>`).join(", ");
      case "allowed_links":
        return (value as string[]).join(", ");
      case "level_roles":
        return (value as servers["level_roles"])
          .map((el) => `${el.level} -> <@&${el.role}>`)
          .join(", ");
      default:
        return "Something went horribly wrong. Please contact Naomi.";
    }
  } catch (err) {
    void beccaErrorHandler(Becca, "render setting module", err);
    return "Something went wrong with rendering this setting.";
  }
};
