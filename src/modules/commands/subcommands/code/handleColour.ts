/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Constructs an embed with a visual representation of the colour passed to
 * the `hex` argument.
 */
export const handleColour: CommandHandler = async (Becca, interaction) => {
  try {
    const targetColour = interaction.options.getString("hex");
    if (!targetColour) {
      await interaction.editReply({ content: Becca.responses.missingParam });
      return;
    }

    const parsedColour = targetColour.startsWith("#")
      ? targetColour.slice(1)
      : targetColour;

    if (!/^[0-9a-fA-F]{6}$/.test(parsedColour)) {
      await interaction.editReply({
        content: "This spell requires a six-character hex code.",
      });
      return;
    }

    const colourEmbed = new MessageEmbed();
    colourEmbed.setTitle(`Colour: ${parsedColour}`);
    colourEmbed.setColor(parseInt(parsedColour, 16));
    colourEmbed.setImage(`https://www.colorhexa.com/${parsedColour}.png`);
    colourEmbed.setTimestamp();

    await interaction.editReply({ embeds: [colourEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "colour command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "colour", errorId)],
        ephemeral: true,
      })
      .catch(async () => {
        await interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "colour", errorId)],
        });
      });
  }
};
