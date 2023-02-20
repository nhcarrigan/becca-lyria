/* eslint-disable jsdoc/require-param */
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

import {
  nextScheduledRelease,
  updatesSinceLastRelease,
} from "../../../config/commands/updatesData";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Generates an embed explaining the new release schedule, and what the update
 * process breaks in terms of lost cache.
 */
export const handleUpdates: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { commitHash: hash } = Becca;
    const updateEmbed = new EmbedBuilder();
    updateEmbed.setTitle(t<string, string>("commands:becca.updates.title"));
    updateEmbed.setDescription(
      t<string, string>("commands:becca.updates.description")
    );
    updateEmbed.addFields([
      {
        name: t<string, string>("commands:becca.updates.latest"),
        value: updatesSinceLastRelease.join("\n"),
      },
      {
        name: t<string, string>("commands:becca.updates.version"),
        value: process.env.npm_package_version || "0.0.0",
      },
      {
        name: t<string, string>("commands:becca.updates.next"),
        value: nextScheduledRelease,
      },
      {
        name: t<string, string>("commands:becca.updates.changelog.title"),
        value: t<string, string>(
          "commands:becca.updates.changelog.description"
        ),
      },
      {
        name: t<string, string>("commands:becca.updates.commit"),
        value: `[${hash.slice(
          0,
          7
        )}](https://github.com/beccalyria/discord-bot/commit/${hash})`,
      },
    ]);
    updateEmbed.setColor(Becca.colours.default);
    updateEmbed.setFooter({
      text: t<string, string>("defaults.footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    const button = new ButtonBuilder()
      .setLabel(t<string, string>("commands:becca.updates.buttons.view"))
      .setEmoji("<:BeccaNotes:883854700762505287>")
      .setStyle(ButtonStyle.Link)
      .setURL(
        "https://docs.beccalyria.com/#/changelog?utm_source=discord&utm_medium=updates-command"
      );

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([button]);
    await interaction.editReply({ embeds: [updateEmbed], components: [row] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "updates command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "updates", errorId, t)],
    });
  }
};
