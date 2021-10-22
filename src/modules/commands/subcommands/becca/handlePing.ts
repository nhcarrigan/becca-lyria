/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Generates an embed with Becca's response time.
 */
export const handlePing: CommandHandler = async (
  Becca,
  interaction
): Promise<void> => {
  try {
    const { createdTimestamp } = interaction;

    const delay = Date.now() - createdTimestamp;
    const isSlow = delay > 100;

    const pingEmbed = new MessageEmbed();
    pingEmbed.setTitle("Pong!");
    pingEmbed.setFooter(
      isSlow
        ? "Kind of in the middle of something here..."
        : "I was bored anyway."
    );
    pingEmbed.setDescription(`Response time: ${delay}ms`);
    pingEmbed.setColor(isSlow ? Becca.colours.error : Becca.colours.success);

    await interaction.editReply({ embeds: [pingEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "ping command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "ping", errorId)],
        ephemeral: true,
      })
      .catch(async () => {
        await interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "ping", errorId)],
        });
      });
  }
};
