/* eslint-disable jsdoc/require-param */
import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Returns a link to the privacy policy.
 */
export const handlePrivacy: CommandHandler = async (Becca, interaction, t) => {
  try {
    const privacyEmbed = new EmbedBuilder();
    privacyEmbed.setTitle(t<string, string>("commands:becca.privacy.title"));
    privacyEmbed.setDescription(
      t<string, string>("commands:becca.privacy.description")
    );
    privacyEmbed.setFooter({
      text: t<string, string>("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await interaction.editReply({ embeds: [privacyEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "privacy command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "privacy", errorId, t)],
    });
  }
};
