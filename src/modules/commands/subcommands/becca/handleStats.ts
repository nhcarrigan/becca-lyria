/* eslint-disable jsdoc/require-jsdoc */
import { MessageEmbed } from "discord.js";

import CommandCountModel from "../../../../database/models/CommandCountModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

export const handleStats: CommandHandler = async (Becca, interaction) => {
  try {
    const { guild, user: author } = interaction;
    if (!guild || !author) {
      await interaction.editReply({ content: Becca.responses.missingGuild });
      return;
    }

    const view = interaction.options.getString("view");

    if (view === "commands") {
      const topServers = await CommandCountModel.find()
        .sort({
          // sort decending, so the top 10 will be the largest.
          commandUses: -1,
        })
        // limit to only the top 10.
        .limit(10)
        // get only the raw data, as we don't need to use the document features.
        .lean();

      // TODO: Update using a formatted text table.
      // see #883
      const topServersEmbed = topServers
        .map(
          (server, index) =>
            `#${index + 1}: ${server.serverName} with ${
              server.commandUses
            } command uses`
        )
        .join("\n");

      const commandEmbed = new MessageEmbed();
      commandEmbed.setTitle("Command Stats");
      commandEmbed.setTimestamp();
      commandEmbed.setColor(Becca.colours.default);
      commandEmbed.setAuthor(
        `${author.username}#${author.discriminator}`,
        author.displayAvatarURL()
      );
      commandEmbed.setDescription(topServersEmbed);

      await interaction.editReply({ embeds: [commandEmbed] });
      return;
    }

    await interaction.editReply({
      content:
        "That appears to be an invalid stat. Not sure how that happened.",
    });
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
      .catch(async () => {
        await interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "stats", errorId)],
        });
      });
  }
};
