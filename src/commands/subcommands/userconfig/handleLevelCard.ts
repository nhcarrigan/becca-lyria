/* eslint-disable jsdoc/require-param */
import { EmbedBuilder } from "discord.js";

import { UserConfigCommandHandler } from "../../../interfaces/commands/UserConfigCommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Handles setting a user's levelcard configuration.
 */
export const handleLevelCard: UserConfigCommandHandler = async (
  Becca,
  interaction,
  t,
  userConfig
) => {
  try {
    const { user } = interaction;
    if (!user) {
      await interaction.editReply({
        content: getRandomValue(t<string, string[]>("responses:missingUser")),
      });
      return;
    }

    const background = interaction.options.getString("background", true);
    const foreground = interaction.options.getString("foreground", true);
    const progress = interaction.options.getString("progress", true);

    const hexRegex = /#[a-f\d]{6}/i;
    if (![background, foreground, progress].every((el) => hexRegex.test(el))) {
      await interaction.editReply({
        content: t<string, string>(
          "commands:userconfig.levelcard.invalidColour"
        ),
      });
      return;
    }

    userConfig.levelcard = { background, foreground, progress };
    await userConfig.save();

    const embed = new EmbedBuilder();
    embed.setTitle(t<string, string>("commands:userconfig.levelcard.title"));
    embed.setDescription(
      t<string, string>("commands:userconfig.levelcard.description")
    );
    embed.setColor(Becca.colours.default);
    embed.addFields([
      {
        name: t<string, string>("commands:userconfig.levelcard.background"),
        value: background || "Not set.",
      },
      {
        name: t<string, string>("commands:userconfig.levelcard.foreground"),
        value: foreground || "Not set.",
      },
      {
        name: t<string, string>("commands:userconfig.levelcard.progress"),
        value: progress || "Not set.",
      },
    ]);
    embed.setFooter({
      text: t<string, string>("defaults.footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await interaction.editReply({ embeds: [embed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "userconfig levelcard",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "userconfig levelcard", errorId, t)],
    });
  }
};
