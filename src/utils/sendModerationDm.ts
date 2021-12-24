import { MessageEmbed, User } from "discord.js";

import { BeccaLyria } from "../interfaces/BeccaLyria";

import { beccaErrorHandler } from "./beccaErrorHandler";
import { customSubstring } from "./customSubstring";

/**
 * Generates a moderation embed notice and sends it to the user.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {string} action The moderation action taken.
 * @param {User} user The Discord user being moderated.
 * @param {string} guildName The name of the guild the moderation occurred in.
 * @param {string} reason The reason for the moderation action.
 * @returns {boolean} True if the message was sent, false otherwise.
 */
export const sendModerationDm = async (
  Becca: BeccaLyria,
  action: "kick" | "ban" | "mute" | "unmute" | "warn",
  user: User,
  guildName: string,
  reason: string
): Promise<boolean> => {
  try {
    const embed = new MessageEmbed();
    embed.setTitle(`${action} Notification!`);
    embed.setDescription(
      `You have received a ${action} in ${guildName} for: \n\n${customSubstring(
        reason,
        2000
      )}`
    );

    const sent = await user
      .send({ embeds: [embed] })
      .then(() => true)
      .catch(() => false);
    return sent;
  } catch (err) {
    await beccaErrorHandler(Becca, "send moderation dm", err, guildName);
    return false;
  }
};
