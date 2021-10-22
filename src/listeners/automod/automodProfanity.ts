/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";
import * as filter from "leo-profanity";

import { defaultServer } from "../../config/database/defaultServer";
import { ListenerHandler } from "../../interfaces/listeners/ListenerHandler";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { customSubstring } from "../../utils/customSubstring";

/**
 * Description coming soon.
 */
export const automodProfanity: ListenerHandler = async (
  Becca,
  message,
  config
) => {
  try {
    if (!filter.check(message.content)) {
      return;
    }

    const string = customSubstring(
      config.profanity_message || defaultServer.profanity_message,
      2000
    ).replace(/\{@username\}/g, `<@!${message.author.id}>`);

    const embed = new MessageEmbed();
    embed.setTitle("Profanity detected!");
    embed.setDescription(string);
    embed.setColor(Becca.colours.error);
    embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
    embed.setTimestamp();

    await message.delete();
    const warning = await message.channel.send({ embeds: [embed] });

    const dmEmbed = new MessageEmbed();
    dmEmbed.setTitle("Your message has been deleted...");
    dmEmbed.setURL(warning.url);
    dmEmbed.setDescription(
      "Here's the contents of the deleted message: \n```\n" +
        filter.clean(message.content, "*", 2) +
        "```"
    );
    dmEmbed.setColor(Becca.colours.error);
    dmEmbed.addField("Server", message.guild?.name || "unknown");
    dmEmbed.addField("Channel", message.channel.toString());
    dmEmbed.addField("Reason", "Profanity detected");

    await message.author.send({ embeds: [dmEmbed] }).catch(() => null);
  } catch (error) {
    await beccaErrorHandler(
      Becca,
      "profanity automod",
      error,
      message.guild?.name,
      message
    );
  }
};
