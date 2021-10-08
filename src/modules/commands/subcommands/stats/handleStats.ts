/* eslint-disable jsdoc/require-jsdoc */
import { MessageEmbed } from "discord.js";

// import CommandModel from "../../../../database/models/CommandModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

export const handleStats: CommandHandler = async (Becca, interaction) => {
  try {
    const { guild, user: author } = interaction;
    if (!guild || !author) {
      // is this correct if there is no author? taken from handleSuggest.
      await interaction.editReply({ content: Becca.responses.missingGuild });
      return;
    }
    // TODO: query to get the top 10.
    // const commandData = await CommandModel.findOne({
    //   serverId: guild.id,
    // });

    const commandEmbed = new MessageEmbed();
    commandEmbed.setTitle("Command Stats");
    commandEmbed.setTimestamp();
    commandEmbed.setColor(Becca.colours.default);
    commandEmbed.setAuthor(
      `${author.username}#${author.discriminator}`,
      author.displayAvatarURL()
    );
    // TODO: add actual top 10 command usage.
    await interaction.editReply({ embeds: [commandEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "stats command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "stats", errorId)],
        ephemeral: true,
      })
      .catch(
        async () =>
          await interaction.editReply({
            embeds: [errorEmbedGenerator(Becca, "stats", errorId)],
          })
      );
  }
};
