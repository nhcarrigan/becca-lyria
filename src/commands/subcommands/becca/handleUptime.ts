/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Generates an embed with Becca's uptime.
 */
export const handleUptime: CommandHandler = async (Becca, interaction, t) => {
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
    uptimeEmbed.setTitle(t("commands:becca.uptime.title"));
    uptimeEmbed.setColor(Becca.colours.default);
    uptimeEmbed.setDescription(t("commands:becca.uptime.description"));
    uptimeEmbed.addField(t("commands:becca.uptime.days"), days.toString());
    uptimeEmbed.addField(
      t("commands:becca.uptime.hours"),
      hours.toString(),
      true
    );
    uptimeEmbed.addField(
      t("commands:becca.uptime.minutes"),
      minutes.toString(),
      true
    );
    uptimeEmbed.addField(
      t("commands:becca.uptime.seconds"),
      secondsRemain.toString(),
      true
    );
    uptimeEmbed.setTimestamp();
    uptimeEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await interaction.editReply({ embeds: [uptimeEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "uptime command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "uptime", errorId, t)],
    });
  }
};
