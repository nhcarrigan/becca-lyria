/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Returns a user's language settings.
 */
export const handleLanguage: CommandHandler = async (Becca, interaction) => {
  try {
    const userLang = interaction.locale;
    const guildLang = interaction.guildLocale;
    const langEmbed = new MessageEmbed();
    langEmbed.setTitle("Language Data");
    langEmbed.setDescription(
      "Here are the language settings Discord has for you."
    );
    langEmbed.addField("Your Language", userLang, true);
    langEmbed.addField("Server Language", guildLang || "unset", true);
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
      embeds: [errorEmbedGenerator(Becca, "language", errorId)],
    });
  }
};
