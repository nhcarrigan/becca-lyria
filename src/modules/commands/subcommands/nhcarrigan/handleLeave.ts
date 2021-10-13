/* eslint-disable jsdoc/require-param */
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Becca will leave the server matching the provided `server-id`.
 */
export const handleLeave: CommandHandler = async (Becca, interaction) => {
  try {
    const serverId = interaction.options.getString("server-id");

    if (!serverId) {
      await interaction.editReply({
        content: "How did you manage to forget the server id?",
      });
      return;
    }
    const targetServer = Becca.guilds.cache.get(`${BigInt(serverId)}`);

    if (!targetServer) {
      await interaction.editReply({
        content: `${serverId} is not a guild I recognise.`,
      });
      return;
    }

    await targetServer.leave();
    await interaction.editReply({
      content: "I have cut all ties with that group.",
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "leave command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "leave", errorId)],
        ephemeral: true,
      })
      .catch(async () => {
        await interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "leaves", errorId)],
        });
      });
  }
};
