/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";

/**
 * Returns a user's language settings.
 */
export const handleLanguage: CommandHandler = async (Becca, interaction, t) => {
  try {
    const userLang = interaction.locale;
    const guildLang = interaction.guildLocale;
    const langEmbed = new MessageEmbed();
    langEmbed.setTitle(t("commands:misc.language.title"));
    langEmbed.setDescription(t("commands:misc.language.description"));
    langEmbed.addField(t("commands:misc.language.yours"), userLang, true);
    langEmbed.addField(
      t("commands:misc.language.server"),
      guildLang || "unset",
      true
    );
    await interaction.editReply({ embeds: [langEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "language command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "language", errorId, t)],
    });
  }
};
