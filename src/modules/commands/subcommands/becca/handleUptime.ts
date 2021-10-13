/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Generates an embed with Becca's uptime.
 */
export const handleUptime: CommandHandler = async (Becca, interaction) => {
  try {
    const seconds = Math.round(process.uptime());
    const days = seconds >= 86400 ? Math.floor(seconds / 86400) : 0;
    const hours =
      seconds >= 3600 ? Math.floor((seconds - days * 86400) / 3600) : 0;
    const minutes =
      seconds >= 60
        ? Math.floor((seconds - days * 86400 - hours * 3600) / 60)
        : 0;
    const secondsRemain = seconds - days * 86400 - hours * 3600 - minutes * 60;

    const uptimeEmbed = new MessageEmbed();
    uptimeEmbed.setTitle("Adventure Duration");
    uptimeEmbed.setColor(Becca.colours.default);
    uptimeEmbed.setDescription("This is how long I have been on my adventure.");
    uptimeEmbed.addField("Days", days.toString());
    uptimeEmbed.addField("Hours", hours.toString(), true);
    uptimeEmbed.addField("Minutes", minutes.toString(), true);
    uptimeEmbed.addField("Seconds", secondsRemain.toString(), true);
    uptimeEmbed.setTimestamp();

    await interaction.editReply({ embeds: [uptimeEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "donate command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "donate", errorId)],
        ephemeral: true,
      })
      .catch(async () => {
        await interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "donate", errorId)],
        });
      });
  }
};
