/* eslint-disable jsdoc/require-param */
import axios from "axios";
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { Quote } from "../../../interfaces/commands/games/Quote";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";

/**
 * Generates an embed containing a random quote.
 */
export const handleQuote: CommandHandler = async (Becca, interaction, t) => {
  try {
    const quote = await axios.get<Quote>(
      "https://api.heptagrambotproject.com/api/v0/quotes/random",
      {
        headers: {
          Authorization: "Bearer " + Becca.configs.heptagramApiToken,
        },
      }
    );

    if (!quote.data || quote.status !== 200) {
      await interaction.editReply({
        content: t("commands:games.quote.no"),
      });
      return;
    }

    const quoteEmbed = new MessageEmbed();
    quoteEmbed.setColor(Becca.colours.default);
    quoteEmbed.setTitle(t("commands:games.quote.title"));
    quoteEmbed.setDescription(`"${quote.data.quote}"\n-- ${quote.data.author}`);
    quoteEmbed.setTimestamp();
    quoteEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
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
