import { Message, MessageEmbed, PartialMessage } from "discord.js";

import { BeccaInt } from "../../interfaces/BeccaInt";
import { sendLogEmbed } from "../../modules/guild/sendLogEmbed";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { customSubstring } from "../../utils/customSubstring";

/**
 * Handles the messageDelete event. Passes the deleted message information
 * to the log channel.
 *
 * @param {BeccaInt} Becca Becca's Discord instance.
 * @param {Message | PartialMessage} message The deleted message object.
 */
export const messageDelete = async (
  Becca: BeccaInt,
  message: Message | PartialMessage
): Promise<void> => {
  try {
    const { author, channel, content, guild, embeds, attachments } = message;

    if (!guild) {
      return;
    }

    const deleteEmbed = new MessageEmbed();
    deleteEmbed.setTitle("Message Deleted");
    deleteEmbed.setColor(Becca.colours.default);
    deleteEmbed.setDescription("Here is my record of that message.");
    deleteEmbed.addField("Channel", `<#${channel.id}>`);
    deleteEmbed.setTimestamp();
    deleteEmbed.addField(
      "Content",
      customSubstring(
        content || "`No content. Embeds or attachments may be coming.`",
        1000
      )
    );

    if (author) {
      deleteEmbed.setFooter(`Author: ${author.id} | Message: ${message.id}`);
      deleteEmbed.setAuthor(
        `${author.username}#${author.discriminator}`,
        author.displayAvatarURL()
      );
    }

    const attached = attachments.first();
    if (attached) {
      deleteEmbed.setImage(attached.proxyURL);
    }

    await sendLogEmbed(Becca, guild, deleteEmbed);

    if (embeds.length) {
      embeds.forEach((embed) => sendLogEmbed(Becca, guild, embed));
    }
  } catch (err) {
    beccaErrorHandler(Becca, "message delete event", err, message.guild?.name);
  }
};
