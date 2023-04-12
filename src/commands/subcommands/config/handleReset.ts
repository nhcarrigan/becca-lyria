/* eslint-disable jsdoc/require-param */
import { DefaultTFuncReturn } from "i18next";

import { SettingsHandler } from "../../../interfaces/settings/SettingsHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { resetSetting } from "../../../modules/settings/resetSetting";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Resets the given `setting` to the default value.
 */
export const handleReset: SettingsHandler = async (
  Becca,
  interaction,
  t,
  config,
  setting
) => {
  try {
    const { guild } = interaction;

    if (!guild) {
      await interaction.editReply({
        content: getRandomValue(
          t<string, DefaultTFuncReturn & string[]>("responses:missingGuild")
        ),
      });
      return;
    }

    const success = await resetSetting(
      Becca,
      guild.id,
      guild.name,
      setting,
      config
    );
    await interaction.editReply(
      success
        ? t("commands:config.reset.success", { setting })
        : t("commands:config.reset.failed")
    );
    return;
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "reset command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "reset", errorId, t)],
    });
  }
};
