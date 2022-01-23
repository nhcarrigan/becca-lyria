import { MessageEmbed, User } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../interfaces/BeccaLyria";
import { ModerationActions } from "../interfaces/commands/moderation/ModerationActions";
import { ServerConfig } from "../interfaces/database/ServerConfig";

import { beccaErrorHandler } from "./beccaErrorHandler";
import { customSubstring } from "./customSubstring";

/**
 * Generates a moderation embed notice and sends it to the user.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {ServerConfig} config The settings for the server where this function was triggered.
 * @param {TFunction} t The i18n function.
 * @param {ModerationActions} action The moderation action taken.
 * @param {User} user The Discord user being moderated.
 * @param {string} reason The reason for the moderation action.
 * @returns {boolean} True if the message was sent, false otherwise.
 */
export const sendModerationDm = async (
  Becca: BeccaLyria,
  config: ServerConfig,
  t: TFunction,
  action: ModerationActions,
  user: User,
  reason: string
): Promise<boolean> => {
  try {
    const embed = new MessageEmbed();
    embed.setTitle(t("defaults:moderation.title", { action }));
    embed.setDescription(
      `${t("defaults:moderation.desc", {
        action,
        name: config.serverName,
      })}\n\n${customSubstring(reason, 2000)}`
    );

    if (action === "ban" && config.appeal_link?.length) {
      embed.addField(t("defaults:moderation.appeal"), config.appeal_link);
    }

    const sent = await user
      .send({ embeds: [embed] })
      .then(() => true)
      .catch(() => false);
    return sent;
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "send moderation dm",
      err,
      config.serverName
    );
    return false;
  }
};
