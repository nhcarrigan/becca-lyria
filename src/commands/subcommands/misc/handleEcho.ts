import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Echos what the user type.
 */
export const handleEcho: CommandHandler = async (Becca, interaction, t) => {
  try {
    interaction.ephemeral = true;
    const input = interaction.options.getString("input") || "";
    await interaction.reply({
      content: input,
    });
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
