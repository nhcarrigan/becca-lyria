/* eslint-disable jsdoc/require-param */
import { EmbedBuilder } from "discord.js";

import { CurrencyHandler } from "../../../interfaces/commands/CurrencyHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Generates an embed describing the currency system.
 */
export const handleAbout: CurrencyHandler = async (Becca, interaction, t) => {
  try {
    const aboutEmbed = new EmbedBuilder();
    aboutEmbed.setTitle("Currency System");
    aboutEmbed.setDescription(
      t<string, string>("commands:currency.about.description")
    );
    aboutEmbed.addFields([
      {
        name: t<string, string>("commands:currency.about.modify.title"),
        value: t<string, string>("commands:currency.about.modify.description"),
      },
      {
        name: t<string, string>("commands:currency.about.cash.title"),
        value: t<string, string>("commands:currency.about.cash.description"),
      },
      {
        name: t<string, string>("commands:currency.about.bots.title"),
        value: t<string, string>("commands:currency.about.bots.description"),
      },
      {
        name: t<string, string>("commands:currency.about.refuse.title"),
        value: t<string, string>("commands:currency.about.refuse.description"),
      },
    ]);
    aboutEmbed.setFooter({
      text: t<string, string>("defaults.footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await interaction.editReply({ embeds: [aboutEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "about command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "about", errorId, t)],
    });
  }
};
