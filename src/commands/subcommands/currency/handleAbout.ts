/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CurrencyHandler } from "../../../interfaces/commands/CurrencyHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Generates an embed describing the currency system.
 */
export const handleAbout: CurrencyHandler = async (Becca, interaction, t) => {
  try {
    const aboutEmbed = new MessageEmbed();
    aboutEmbed.setTitle("Currency System");
    aboutEmbed.setDescription(t("commands:currency.about.description"));
    aboutEmbed.addField(
      t("commands:currency.about.modify.title"),
      t("commands:currency.about.modify.description")
    );
    aboutEmbed.addField(
      t("commands:currency.about.cash.title"),
      t("commands:currency.about.cash.description")
    );
    aboutEmbed.addField(
      t("commands:currency.about.bots.title"),
      t("commands:currency.about.bots.description")
    );
    aboutEmbed.addField(
      t("commands:currency.about.refuse.title"),
      t("commands:currency.about.refuse.description")
    );
    aboutEmbed.setFooter({
      text: t("defaults:donate"),
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
