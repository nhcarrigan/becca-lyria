/* eslint-disable jsdoc/require-param */
import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Generates an embed containing CanIUse browser data for the given `feature` argument.
 */
export const handleCanIUse: CommandHandler = async (Becca, interaction, t) => {
  try {
    const feature = interaction.options.getString("feature", true);

    const caniuseEmbed = new EmbedBuilder();
    caniuseEmbed.setTitle(
      t<string, string>("commands:code.caniuse.title", { feature })
    );
    caniuseEmbed.setImage(`https://caniuse.bitsofco.de/image/${feature}.webp`);
    caniuseEmbed.setTimestamp();
    caniuseEmbed.setColor(Becca.colours.default);
    caniuseEmbed.setFooter({
      text: t<string, string>("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await interaction.editReply({ embeds: [caniuseEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "caniuse command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "caniuse", errorId, t)],
    });
  }
};
