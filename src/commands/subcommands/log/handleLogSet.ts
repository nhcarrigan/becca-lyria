/* eslint-disable jsdoc/require-param */
import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { LogSettings } from "../../../interfaces/settings/LogSettings";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { renderSetting } from "../../../modules/settings/renderSetting";
import { setSetting } from "../../../modules/settings/setSetting";
import { validateSetting } from "../../../modules/settings/validateSetting";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Provided the `value` is valid, sets the given `setting` to that `value`.
 */
export const handleLogSet: CommandHandler = async (
  Becca,
  interaction,
  t,
  config
) => {
  try {
    const { guild } = interaction;

    if (!guild) {
      await interaction.editReply({
        content: getRandomValue(t("responses:missingGuild")),
      });
      return;
    }

    const setting = interaction.options.getString("event", true);
    const value = interaction.options.getChannel("channel", true);

    const isValid = await validateSetting(
      Becca,
      setting as LogSettings,
      value.id,
      guild,
      config
    );
    if (!isValid) {
      await interaction.editReply(
        t("commands:log.set.invalid", { value, setting })
      );
      return;
    }

    const isSet = await setSetting(
      Becca,
      guild.id,
      guild.name,
      setting as LogSettings,
      value.id,
      config
    );

    if (!isSet) {
      await interaction.editReply(t("commands:log.set.failed"));
      return;
    }
    const newContent = isSet[setting as LogSettings];
    const parsedContent = renderSetting(
      Becca,
      setting as LogSettings,
      newContent
    );
    const successEmbed = new EmbedBuilder();
    successEmbed.setTitle(t("commands:log.set.title", { setting }));
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
      "log set command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "log set", errorId, t)],
    });
  }
};
