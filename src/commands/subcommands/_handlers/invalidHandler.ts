import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { CommandName } from "../../../interfaces/commands/CommandName";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

export const invalidHandler = (command: CommandName) => {
  const handler: CommandHandler = async (Becca, interaction, t) => {
    try {
      await interaction.reply({
        content: `${interaction.commandName} is not a valid command.`,
      });
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "becca group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, `${command} group`, errorId, t)],
      });
    }
  };
  return handler;
};
