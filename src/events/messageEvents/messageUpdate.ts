import { Message, MessageEmbed, PartialMessage } from "discord.js";
import { getFixedT } from "i18next";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { automodListener } from "../../listeners/automodListener";
import { emoteListener } from "../../listeners/emoteListener";
import { sassListener } from "../../listeners/sassListener";
import { triggerListener } from "../../listeners/triggerListener";
import { sendLogEmbed } from "../../modules/guild/sendLogEmbed";
import { getSettings } from "../../modules/settings/getSettings";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { generateDiff } from "../../utils/generateDiff";

/**
 * Handles the messageUpdate event. Validates that the content in the message
 * changed, then sends an embed with the change details to the log channel.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {Message | PartialMessage} oldMessage Old message object.
 * @param {Message | PartialMessage} newMessage New message object.
 */
export const messageUpdate = async (
  Becca: BeccaLyria,
  oldMessage: Message | PartialMessage,
  newMessage: Message | PartialMessage
): Promise<void> => {
  try {
    const { author, guild, content: newContent } = newMessage;
    const { content: oldContent } = oldMessage;

    if (!guild || newMessage.channel.type === "DM") {
      return;
    }
    const lang = guild.preferredLocale;
    const t = getFixedT(lang);

    const serverConfig = await getSettings(Becca, guild.id, guild.name);

    if (!serverConfig) {
      return;
    }

    if (oldContent && newContent && oldContent === newContent) {
      return;
    }

    if (!author || author.bot) {
      return;
    }

    const diffContent =
      oldContent && newContent
        ? generateDiff(oldContent, newContent)
        : t("events:message.edit.nocont");

    const updateEmbed = new MessageEmbed();
    updateEmbed.setTitle(t("events:message.edit.title"));
    updateEmbed.setAuthor({
      name: author.tag,
      iconURL: author.displayAvatarURL(),
    });
    updateEmbed.setDescription(`\`\`\`diff\n${diffContent}\`\`\``);
    updateEmbed.setFooter(`Author: ${author.id} | Message: ${oldMessage.id}`);
    updateEmbed.setColor(Becca.colours.default);
    updateEmbed.setTimestamp();
    updateEmbed.addField(
      t("events:message.edit.chan"),
      `<#${newMessage.channel.id}>`
    );
    updateEmbed.addField(t("events:message.edit.link"), newMessage.url);

    await sendLogEmbed(Becca, guild, updateEmbed, "message_events");

    const message = await newMessage.fetch();

    await sassListener.run(Becca, message, t, serverConfig);
    await automodListener.run(Becca, message, t, serverConfig);
    await triggerListener.run(Becca, message, t, serverConfig);
    await emoteListener.run(Becca, message, t, serverConfig);
    Becca.pm2.metrics.events.mark();
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "message update event",
      err,
      oldMessage.guild?.name
    );
  }
};
