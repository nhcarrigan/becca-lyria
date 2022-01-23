import { Message, MessageEmbed, PartialMessage } from "discord.js";
import { getFixedT } from "i18next";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { sendLogEmbed } from "../../modules/guild/sendLogEmbed";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { customSubstring } from "../../utils/customSubstring";

/**
 * Handles the messageDelete event. Passes the deleted message information
 * to the log channel.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {Message | PartialMessage} message The deleted message object.
 */
export const messageDelete = async (
  Becca: BeccaLyria,
  message: Message | PartialMessage
): Promise<void> => {
  try {
    const { author, channel, content, guild, embeds, attachments } = message;

    if (!guild) {
      return;
    }

    const lang = guild.preferredLocale;
    const t = getFixedT(lang);

    const deleteEmbed = new MessageEmbed();
    deleteEmbed.setTitle(t("events:message.delete.title"));
    deleteEmbed.setColor(Becca.colours.default);
    deleteEmbed.setDescription(t("events:message.delete.desc"));
    deleteEmbed.addField(t("events:message.delete.chan"), `<#${channel.id}>`);
    deleteEmbed.setTimestamp();
    deleteEmbed.addField(
      t("events:message.delete.cont"),
      customSubstring(content || t("events:message.delete.nocont"), 1000)
    );

    if (author) {
      deleteEmbed.setFooter(`Author: ${author.id} | Message: ${message.id}`);
      deleteEmbed.setAuthor({
        name: author.tag,
        iconURL: author.displayAvatarURL(),
      });
    }

    const attached = attachments.first();
    if (attached) {
      deleteEmbed.setImage(attached.proxyURL);
    }

    await sendLogEmbed(Becca, guild, deleteEmbed, "message_events");

    if (embeds.length) {
      embeds.forEach((embed) =>
        sendLogEmbed(Becca, guild, embed, "message_events")
      );
    }
    Becca.pm2.metrics.events.mark();
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "message delete event",
      err,
      message.guild?.name
    );
  }
};
