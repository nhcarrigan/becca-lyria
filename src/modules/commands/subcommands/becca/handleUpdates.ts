/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import {
  nextScheduledRelease,
  updatesSinceLastRelease,
} from "../../../../config/commands/updatesData";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Generates an embed explaining the new release schedule, and what the update
 * process breaks in terms of lost cache.
 */
export const handleUpdates: CommandHandler = async (Becca, interaction) => {
  try {
    const updateEmbed = new MessageEmbed();
    updateEmbed.setTitle("Update Information");
    updateEmbed.setDescription(
      "Becca's updates are deployed every Monday at 10AM Pacific Time. This is important information to know, as these deployments clear the cache. This results in any outstanding cache-reliant features, such as polls, trivia games, or scheduled posts, to be lost. Please plan your interactions around this schedule."
    );
    updateEmbed.addField("Latest Updates", updatesSinceLastRelease.join("\n"));
    updateEmbed.addField(
      "Current Version",
      process.env.npm_package_version || "0.0.0"
    );
    updateEmbed.addField("Next Scheduled Update", nextScheduledRelease);
    updateEmbed.addField(
      "Changelog",
      "View Becca's entire change log [in her documentation](https://docs.beccalyria.com/#/changelog)."
    );
    updateEmbed.setColor(Becca.colours.default);
    await interaction.editReply({ embeds: [updateEmbed] });
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
      .catch(
        async () =>
          await interaction.editReply({
            embeds: [errorEmbedGenerator(Becca, "ping", errorId)],
          })
      );
  }
};
