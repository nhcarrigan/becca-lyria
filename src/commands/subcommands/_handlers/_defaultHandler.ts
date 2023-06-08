import { SubcommandHandlers } from "../../../config/commands/_handlers";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { CommandName } from "../../../interfaces/commands/CommandName";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { handleInvalidSubcommand } from "../handleInvalidSubcommand";

export const defaultHandler = (command: CommandName) => {
  const handler: CommandHandler = async (Becca, interaction, t, config) => {
    try {
      const subCommand = interaction.options.getSubcommand();
      await interaction.deferReply();

      const handler =
        SubcommandHandlers[command][subCommand] || handleInvalidSubcommand;
      await handler(Becca, interaction, t, config);
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
