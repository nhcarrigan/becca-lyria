/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";
import { generateUsername } from "../../../commands/general/generateUsername";

/**
 * Generates a random DigitalOcean themed username and sends it in an embed.
 * Limits the length of the username to `length`, or 30.
 */
export const handleUsername: CommandHandler = async (Becca, interaction) => {
  try {
    const { user } = interaction;
    const length = interaction.options.getInteger("length") || 30;

    const username = generateUsername(length);

    const usernameEmbed = new MessageEmbed();
    usernameEmbed.setColor(Becca.colours.default);
    usernameEmbed.setAuthor(
      `${user.username}#${user.discriminator}`,
      user.displayAvatarURL()
    );
    usernameEmbed.setDescription(
      "This feature brought to you by [MattIPv4](https://github.com/mattipv4)."
    );
    usernameEmbed.addField("Your username is...", username);
    usernameEmbed.addField(
      "Generated Length",
      username.length.toString(),
      true
    );
    usernameEmbed.addField("Maximum length", length.toString(), true);

    await interaction.editReply({ embeds: [usernameEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "username command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "username", errorId)],
        ephemeral: true,
      })
      .catch(async () => {
        await interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "username", errorId)],
        });
      });
  }
};
