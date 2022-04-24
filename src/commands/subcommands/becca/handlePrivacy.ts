/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";

/**
 * Returns a link to the privacy policy.
 */
export const handlePrivacy: CommandHandler = async (Becca, interaction, t) => {
  try {
    const privacyEmbed = new MessageEmbed();
    privacyEmbed.setTitle(t("commands:becca.privacy.title"));
    privacyEmbed.setDescription(t("commands:becca.privacy.description"));
    privacyEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
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
