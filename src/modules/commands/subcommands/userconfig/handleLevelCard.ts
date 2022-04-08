/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { UserConfigCommandHandler } from "../../../../interfaces/commands/UserConfigCommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

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
        content: getRandomValue(t("responses:missingUser")),
      });
      return;
    }

    const background = interaction.options.getString("background", true);
    const foreground = interaction.options.getString("foreground", true);
    const progress = interaction.options.getString("progress", true);

    const hexRegex = /#[a-f\d]{6}/i;
    if (![background, foreground, progress].every((el) => hexRegex.test(el))) {
      await interaction.editReply({
        content: t("commands:userconfig.levelcard.invalidColour"),
      });
      return;
    }

    userConfig.levelcard = { background, foreground, progress };
    await userConfig.save();

    const embed = new MessageEmbed();
    embed.setTitle(t("commands:userconfig.levelcard.title"));
    embed.setDescription(t("commands:userconfig.levelcard.description"));
    embed.setColor(Becca.colours.default);
    embed.addField(
      t("commands:userconfig.levelcard.background"),
      background || "Not set."
    );
    embed.addField(
      t("commands:userconfig.levelcard.foreground"),
      foreground || "Not set."
    );
    embed.addField(
      t("commands:userconfig.levelcard.progress"),
      progress || "Not set."
    );
    embed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
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
