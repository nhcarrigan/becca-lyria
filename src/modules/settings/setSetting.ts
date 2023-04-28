/* eslint-disable no-case-declarations */
import { servers } from "@prisma/client";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { Settings } from "../../interfaces/settings/Settings";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { beccaLogHandler } from "../../utils/beccaLogHandler";

/**
 * This handles all of the logic for setting a server's config. Depending on
 * the type of the data stored, it will handle the array or string logic
 * as necessary.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {string} serverName The current name of the server.
 * @param {Settings} key The name of the setting to modify.
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
    const parsedValue =
      typeof value === "string" ? value.replace(/\D/g, "") : value;

    switch (key) {
      case "automod_channels":
      case "no_automod_channels":
      case "hearts":
      case "blocked":
      case "automod_roles":
      case "level_ignore":
      case "emote_channels":
        if (server[key].includes(parsedValue)) {
          const index = server[key].indexOf(parsedValue);
          server[key].splice(index, 1);
        } else {
          server[key].push(parsedValue);
        }
        break;
      case "allowed_links":
        if (server[key].includes(value)) {
          const index = server[key].indexOf(value);
          server[key].splice(index, 1);
        } else {
          server[key].push(value);
        }
        break;
      case "level_roles":
        const [level, role] = value.split(" ");
        const hasSetting = server[key].findIndex(
          (el) =>
            el.role === role.replace(/\D/g, "") &&
            el.level === parseInt(level, 10)
        );
        if (hasSetting === -1) {
          server[key].push({
            level: parseInt(level, 10),
            role: role.replace(/\D/g, ""),
          });
        } else {
          server[key].splice(hasSetting, 1);
        }
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
        server[key] = value;
        break;
      case "starboard_threshold":
      case "level_decay":
        server[key] = parseInt(value, 10);
        break;
      case "antiphish":
        server[key] = value as "none" | "mute" | "kick" | "ban";
        break;
      case "level_style":
      case "welcome_style":
        server[key] = value as "embed" | "text";
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
        server[key] = value.replace(/\D/g, "");
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
