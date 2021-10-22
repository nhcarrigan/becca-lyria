/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { httpStatus } from "../../../../config/commands/httpStatus";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Returns a cat photo depicting the given HTTP `status`.
 */
export const handleHttp: CommandHandler = async (Becca, interaction) => {
  try {
    const status = interaction.options.getInteger("status", true);

    if (!httpStatus.includes(status)) {
      await interaction.editReply({
        content: "That is not a valid HTTP status code.",
      });
      return;
    }
    const httpEmbed = new MessageEmbed();
    httpEmbed.setTitle(`HTTP code ${status}`);
    httpEmbed.setImage(`https://http.cat/${status}.jpg`);
    httpEmbed.setColor(Becca.colours.default);
    httpEmbed.setTimestamp();

    await interaction.editReply({ embeds: [httpEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "http command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "http", errorId)],
        ephemeral: true,
      })
      .catch(async () => {
        await interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "http", errorId)],
        });
      });
  }
};
