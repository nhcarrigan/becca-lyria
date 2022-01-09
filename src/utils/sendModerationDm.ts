import { MessageEmbed, User, Guild } from "discord.js";

import ServerModel from "../database/models/ServerConfigModel";
import { BeccaLyria } from "../interfaces/BeccaLyria";
import { ModerationActions } from "../interfaces/commands/moderation/ModerationActions";

import { beccaErrorHandler } from "./beccaErrorHandler";
import { customSubstring } from "./customSubstring";

/**
 * Generates a moderation embed notice and sends it to the user.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {ModerationActions} action The moderation action taken.
 * @param {User} user The Discord user being moderated.
 * @param {string} guild The guild the moderation occurred in.
 * @param {string} reason The reason for the moderation action.
 * @returns {boolean} True if the message was sent, false otherwise.
 */
export const sendModerationDm = async (
  Becca: BeccaLyria,
  action: ModerationActions,
  user: User,
  guild: Guild,
  reason: string
): Promise<boolean> => {
  try {
    const embed = new MessageEmbed();
    embed.setTitle(`${action} Notification!`);
    embed.setDescription(
      `You have received a ${action} in ${
        guild.name
      } for: \n\n${customSubstring(reason, 2000)}`
    );

    if (action === "ban") {
      const serverID = guild.id;
      const server = (await ServerModel.findOne({ serverID })) || null;

      if (server && server.appeal_link.length) {
        embed.addField(
          "You can appeal your ban using this link: ",
          server.appeal_link
        );
      }
    }

    const sent = await user
      .send({ embeds: [embed] })
      .then(() => true)
      .catch(() => false);
    return sent;
  } catch (err) {
    await beccaErrorHandler(Becca, "send moderation dm", err, guild.name);
    return false;
  }
};
