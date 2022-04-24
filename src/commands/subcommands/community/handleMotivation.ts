/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { motivationalQuotes } from "../../../config/commands/motivationalQuotes";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";

/**
 * Returns a random motivational quote, formatted in an embed.
 * TODO: Determine how to i18n the quotes...
 */
export const handleMotivation: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const random = Math.floor(Math.random() * motivationalQuotes.length);
    const quote = motivationalQuotes[random];
    const quoteEmbed = new MessageEmbed();
    quoteEmbed.setTitle("We are counting on you!");
    quoteEmbed.setDescription(quote.quote);
    quoteEmbed.setFooter(quote.author);
    quoteEmbed.setTimestamp();
    quoteEmbed.setColor(Becca.colours.default);
    quoteEmbed.setFooter(
      "Like the bot? Donate: https://donate.nhcarrigan.com",
      "https://cdn.nhcarrigan.com/profile-transparent.png"
    );

    await interaction.editReply({ embeds: [quoteEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "motivation command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "motivation", errorId, t)],
    });
  }
};
