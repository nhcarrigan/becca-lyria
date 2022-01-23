/* eslint-disable jsdoc/require-param */
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

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
export const handleUpdates: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { commitHash: hash } = Becca;
    const updateEmbed = new MessageEmbed();
    updateEmbed.setTitle(t("commands:becca.updates.title"));
    updateEmbed.setDescription(t("commands:becca.updates.description"));
    updateEmbed.addField(
      t("commands:becca.updates.latest"),
      updatesSinceLastRelease.join("\n")
    );
    updateEmbed.addField(
      t("commands:becca.updates.version"),
      process.env.npm_package_version || "0.0.0"
    );
    updateEmbed.addField(
      t("commands:becca.updates.next"),
      nextScheduledRelease
    );
    updateEmbed.addField(
      t("commands:becca.updates.changelog.title"),
      t("commands:becca.updates.changelog.description")
    );
    updateEmbed.addField(
      t("commands:becca.updates.commit"),
      `[${hash.slice(
        0,
        7
      )}](https://github.com/beccalyria/discord-bot/commit/${hash})`
    );
    updateEmbed.setColor(Becca.colours.default);
    updateEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
    });

    const button = new MessageButton()
      .setLabel(t("commands:becca.updates.buttons.view"))
      .setEmoji("<:BeccaNotes:883854700762505287>")
      .setStyle("LINK")
      .setURL("https://docs.beccalyria.com/#/changelog");

    const row = new MessageActionRow().addComponents([button]);
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
