/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { SusColours, SusNames } from "../../../../config/commands/susList";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Generates an embed with a random colour from Among Us, and delcares that
 * colour the new sus.
 */
export const handleSus: CommandHandler = async (Becca, interaction) => {
  try {
    const random = Math.floor(Math.random() * SusNames.length);
    const susEmbed = new MessageEmbed();
    susEmbed.setTitle("Emergency Meeting!");
    susEmbed.setDescription(SusNames[random] + " is the new SUS!");
    susEmbed.setColor(SusColours[random]);
    susEmbed.setTimestamp();

    await interaction.editReply({ embeds: [susEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "sus command",
      err,
      interaction.guild?.name
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "sus", errorId)],
    });
  }
};
