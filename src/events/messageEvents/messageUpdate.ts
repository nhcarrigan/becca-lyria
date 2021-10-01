import { Message, MessageEmbed, PartialMessage } from "discord.js";

import { BeccaInt } from "../../interfaces/BeccaInt";
import { sendLogEmbed } from "../../modules/guild/sendLogEmbed";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { customSubstring } from "../../utils/customSubstring";

/**
 * Handles the messageUpdate event. Validates that the content in the message
 * changed, then sends an embed with the change details to the log channel.
 *
 * @param {BeccaInt} Becca Becca's Discord instance.
 * @param {Message | PartialMessage} oldMessage Old message object.
 * @param {Message | PartialMessage} newMessage New message object.
 */
export const messageUpdate = async (
  Becca: BeccaInt,
  oldMessage: Message | PartialMessage,
  newMessage: Message | PartialMessage
): Promise<void> => {
  try {
    const { author, guild, content: newContent } = newMessage;
    const { content: oldContent } = oldMessage;

    if (oldContent && newContent && oldContent === newContent) {
      return;
    }

    if (!guild || !author || author.bot) {
      return;
    }

    const updateEmbed = new MessageEmbed();
    updateEmbed.setTitle("Message Updated");
    updateEmbed.setAuthor(
      `${author.username}#${author.discriminator}`,
      author.displayAvatarURL()
    );
    updateEmbed.addField(
      "Old Content",
      customSubstring(oldContent || "`No content here.`", 1000)
    );
    updateEmbed.addField(
      "New Content",
      customSubstring(newContent || "`No content here.`", 1000)
    );
    updateEmbed.setFooter(`Author: ${author.id} | Message: ${oldMessage.id}`);
    updateEmbed.setColor(Becca.colours.default);
    updateEmbed.setTimestamp();
    updateEmbed.addField("Channel", `<#${newMessage.channel.id}>`);
    updateEmbed.messageLink(newMessage.url)

    await sendLogEmbed(Becca, guild, updateEmbed);
  } catch (err) {
    beccaErrorHandler(
      Becca,
      "message update event",
      err,
      oldMessage.guild?.name
    );
  }
};
