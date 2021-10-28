/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Generates an embed containing CanIUse browser data for the given `feature` argument.
 */
export const handleCanIUse: CommandHandler = async (Becca, interaction) => {
  try {
    const feature = interaction.options.getString("feature", true);

    const caniuseEmbed = new MessageEmbed();
    caniuseEmbed.setTitle(`Can I Use ${feature}`);
    caniuseEmbed.setImage(`https://caniuse.bitsofco.de/image/${feature}.webp`);
    caniuseEmbed.setTimestamp();
    caniuseEmbed.setColor(Becca.colours.default);

    await interaction.editReply({ embeds: [caniuseEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "caniuse command",
      err,
      interaction.guild?.name
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "caniuse", errorId)],
    });
  }
};
