/* eslint-disable jsdoc/require-param */
import { EmbedBuilder } from "discord.js";

import { SettingsHandler } from "../../../interfaces/settings/SettingsHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { renderSetting } from "../../../modules/settings/renderSetting";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Generates an embed showing the current server `setting` values. If `setting` is global,
 * shows the top-level overview.
 */
export const handleView: SettingsHandler = async (
  Becca,
  interaction,
  t,
  config,
  setting,
  value
) => {
  try {
    const { guild } = interaction;

    if (!guild) {
      await interaction.editReply({
        content: getRandomValue(t<string, string[]>("responses:missingGuild")),
      });
      return;
    }

    const embed = new EmbedBuilder();
    embed.setTitle(
      t<string, string>("commands:config.view.title", { name: setting })
    );
    embed.setTimestamp();
    embed.setColor(Becca.colours.default);
    embed.setFooter({
      text: t<string, string>("defaults.footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });
    embed.setDescription(
      renderSetting(Becca, setting, config[setting] || value)
    );
    await interaction.editReply({ embeds: [embed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "view command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "view", errorId, t)],
    });
  }
};
