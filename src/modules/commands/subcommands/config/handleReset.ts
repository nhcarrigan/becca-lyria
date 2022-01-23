/* eslint-disable jsdoc/require-param */
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { Settings } from "../../../../interfaces/settings/Settings";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";
import { resetSetting } from "../../../settings/resetSetting";

/**
 * Resets the given `setting` to the default value.
 */
export const handleReset: CommandHandler = async (
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

    const setting = interaction.options.getString("setting");
    const success = await resetSetting(
      Becca,
      guild.id,
      guild.name,
      setting as Settings,
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
      embeds: [errorEmbedGenerator(Becca, "reset", errorId)],
    });
  }
};
