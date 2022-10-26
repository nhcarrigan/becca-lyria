/* eslint-disable jsdoc/require-param */
import axios from "axios";
import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { Quote } from "../../../interfaces/commands/games/Quote";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Generates an embed containing a random quote.
 */
export const handleQuote: CommandHandler = async (Becca, interaction, t) => {
  try {
    const quote = await axios.get<Quote>(
      "https://api.heptagrambotproject.com/v4/quotes/random",
      {
        headers: {
          Authorization: "Bearer " + Becca.configs.heptagramApiToken,
        },
      }
    );

    if (!quote.data || quote.status !== 200) {
      await interaction.editReply({
        content: t<string, string>("commands:games.quote.no"),
      });
      return;
    }

    const quoteEmbed = new EmbedBuilder();
    quoteEmbed.setColor(Becca.colours.default);
    quoteEmbed.setTitle(t<string, string>("commands:games.quote.title"));
    quoteEmbed.setDescription(`"${quote.data.quote}"\n-- ${quote.data.author}`);
    quoteEmbed.setTimestamp();
    quoteEmbed.setFooter({
      text: t<string, string>("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });
    await interaction.editReply({ embeds: [quoteEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "quote command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "quote", errorId, t)],
    });
  }
};
