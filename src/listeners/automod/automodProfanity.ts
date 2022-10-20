/* eslint-disable jsdoc/require-param */
import { EmbedBuilder } from "discord.js";
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
  t,
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

    const embed = new EmbedBuilder();
    embed.setTitle(t<string, string>("listeners:automod.profanity.title"));
    embed.setDescription(string);
    embed.setColor(Becca.colours.error);
    embed.setAuthor({
      name: message.author.tag,
      iconURL: message.author.displayAvatarURL(),
    });
    embed.setTimestamp();
    embed.setFooter({
      text: t<string, string>("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await message.delete();
    const warning = await message.channel.send({ embeds: [embed] });

    const dmEmbed = new EmbedBuilder();
    dmEmbed.setTitle(t<string, string>("listeners:automod.profanity.dmTitle"));
    dmEmbed.setURL(warning.url);
    dmEmbed.setDescription(
      `${t<string, string>(
        "listeners:automod.profanity.dmDesc"
      )}\n\`\`\`\n${filter.clean(message.content, "*", 2)}\n\`\`\``
    );
    dmEmbed.setColor(Becca.colours.error);
    dmEmbed.addFields([
      {
        name: t<string, string>("listeners:automod.profanity.reason"),
        value: message.guild?.name || "unknown",
      },
      {
        name: t<string, string>("listeners:automod.profanity.channel"),
        value: message.channel.toString(),
      },
      {
        name: t<string, string>("listeners:automod.profanity.reason"),
        value: t<string, string>("listeners:automod.profanity.profane"),
      },
    ]);

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
