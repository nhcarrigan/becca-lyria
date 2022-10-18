/* eslint-disable jsdoc/require-param */
import { EmbedBuilder } from "discord.js";

import { Settings } from "../../../interfaces/settings/Settings";
import { SettingsHandler } from "../../../interfaces/settings/SettingsHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { renderSetting } from "../../../modules/settings/renderSetting";
import { setSetting } from "../../../modules/settings/setSetting";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Provided the `value` is valid, sets the given `setting` to that `value`.
 */
export const handleSet: SettingsHandler = async (
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
        content: getRandomValue(t("responses:missingGuild")),
      });
      return;
    }

    const isSet = await setSetting(
      Becca,
      guild.id,
      guild.name,
      setting as Settings,
      value,
      config
    );

    if (!isSet) {
      await interaction.editReply(t("commands:config.set.failed"));
      return;
    }
    const newContent = isSet[setting as Settings];
    const parsedContent = renderSetting(Becca, setting, newContent);
    const successEmbed = new EmbedBuilder();
    successEmbed.setTitle(t("commands:config.set.title", { setting }));
    successEmbed.setDescription(customSubstring(parsedContent, 2000));
    successEmbed.setTimestamp();
    successEmbed.setColor(Becca.colours.default);
    successEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });
    await interaction.editReply({ embeds: [successEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "set command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "set", errorId, t)],
    });
  }
};
