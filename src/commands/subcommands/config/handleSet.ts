/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { Settings } from "../../../interfaces/settings/Settings";
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
export const handleSet: CommandHandler = async (
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

    const setting = interaction.options.getString("setting", true);
    const value = interaction.options.getString("value", true);

    const isValid = await validateSetting(
      Becca,
      setting as Settings,
      value,
      guild,
      config
    );
    if (!isValid) {
      await interaction.editReply(
        t("commands:config.set.invalid", { value, setting })
      );
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
    const parsedContent = Array.isArray(newContent)
      ? newContent
          .map((el) => renderSetting(Becca, setting as Settings, el))
          .join(", ")
      : renderSetting(Becca, setting as Settings, newContent);
    const successEmbed = new MessageEmbed();
    successEmbed.setTitle(t("commands:config.set.title", { setting }));
    successEmbed.setDescription(customSubstring(parsedContent, 2000));
    successEmbed.setTimestamp();
    successEmbed.setColor(Becca.colours.default);
    successEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
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
