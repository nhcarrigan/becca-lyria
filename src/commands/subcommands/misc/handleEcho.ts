import { PermissionFlagsBits } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Echos what the user type.
 */
export const handleEcho: CommandHandler = async (Becca, interaction, t) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const input = interaction.options.getString("input", true);
    if (
      interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)
    ) {
      interaction.channel.send(input);
    } else {
      //TODO: Use the translation system to get the text.
      await interaction.reply({
        content: "You are not allowed to send messages as Becca",
      });
    }
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "echo command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "echo", errorId, t)],
    });
  }
};
