import { servers } from "@prisma/client";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { beccaLogHandler } from "../../utils/beccaLogHandler";

import { settingsSetters } from "./settingsSetters";

/**
 * This handles all of the logic for setting a server's config. Depending on
 * the type of the data stored, it will handle the array or string logic
 * as necessary.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {string} serverName The current name of the server.
 * @param {keyof servers} key The name of the setting to modify.
 * @param {string} value The value to change the setting to.
 * @param {servers} server The server config entry in the database.
 * @returns {servers | null} ServerModel on success and null on error.
 */
export const setSetting = async (
  Becca: BeccaLyria,
  serverName: string,
  key: keyof servers,
  value: string,
  server: servers
): Promise<servers | null> => {
  try {
    switch (key) {
      case "automod_channels":
      case "no_automod_channels":
      case "hearts":
      case "blocked":
      case "automod_roles":
      case "level_ignore":
      case "emote_channels":
        settingsSetters.setArrayOfIdSetting(server, key, value);
        break;
      case "allowed_links":
        settingsSetters.setArrayOfStringSetting(server, key, value);
        break;
      case "level_roles":
        settingsSetters.setArrayOfLevelRoleSetting(server, key, value);
        break;
      case "custom_welcome":
      case "levels":
      case "link_message":
      case "leave_message":
      case "sass_mode":
      case "links":
      case "profanity":
      case "profanity_message":
      case "appeal_link":
      case "initial_xp":
      case "level_message":
      case "role_message":
      case "starboard_emote":
        settingsSetters.setStringSetting(server, key, value);
        break;
      case "starboard_threshold":
      case "level_decay":
        settingsSetters.setNumberSetting(server, key, value);
        break;
      case "antiphish":
        settingsSetters.setAntiphishSetting(server, key, value);
        break;
      case "level_style":
      case "welcome_style":
        settingsSetters.setStyleSetting(server, key, value);
        break;
      case "welcome_channel":
      case "depart_channel":
      case "message_events":
      case "voice_events":
      case "thread_events":
      case "moderation_events":
      case "member_events":
      case "level_channel":
      case "suggestion_channel":
      case "join_role":
      case "report_channel":
      case "ticket_category":
      case "ticket_log_channel":
      case "ticket_role":
      case "starboard_channel":
        settingsSetters.setIdSetting(server, key, value);
        break;
      default:
        beccaLogHandler.log("error", "the setSettings logic broke horribly.");
    }
    return server;
  } catch (err) {
    await beccaErrorHandler(Becca, "set setting module", err, serverName);
    return null;
  }
};
