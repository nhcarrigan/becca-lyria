import { PermissionFlagsBits } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { tFunctionArrayWrapper } from "../../../utils/tFunctionWrapper";

/**
 * Echos what the user type.
 */
export const handleEcho: CommandHandler = async (Becca, interaction, t) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const input = interaction.options.getString("input", true);
    if (
      !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)
    ) {
      await interaction.reply({
        content: tFunctionArrayWrapper(t, "responses:noPermission"),
      });
    } else {
      interaction.channel.send(input);
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
