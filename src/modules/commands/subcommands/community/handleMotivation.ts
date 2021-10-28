/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { motivationalQuotes } from "../../../../config/commands/motivationalQuotes";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Returns a random motivational quote, formatted in an embed.
 */
export const handleMotivation: CommandHandler = async (Becca, interaction) => {
  try {
    const random = Math.floor(Math.random() * motivationalQuotes.length);
    const quote = motivationalQuotes[random];
    const quoteEmbed = new MessageEmbed();
    quoteEmbed.setTitle("We are counting on you!");
    quoteEmbed.setDescription(quote.quote);
    quoteEmbed.setFooter(quote.author);
    quoteEmbed.setTimestamp();
    quoteEmbed.setColor(Becca.colours.default);

    await interaction.editReply({ embeds: [quoteEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "motivation command",
      err,
      interaction.guild?.name
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "motivation", errorId)],
    });
  }
};
