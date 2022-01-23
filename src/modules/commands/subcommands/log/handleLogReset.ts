/* eslint-disable jsdoc/require-param */
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { LogSettings } from "../../../../interfaces/settings/LogSettings";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { resetSetting } from "../../../settings/resetSetting";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Resets the given `setting` to the default value.
 */
export const handleLogReset: CommandHandler = async (
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

    const setting = interaction.options.getString("event");
    const success = await resetSetting(
      Becca,
      guild.id,
      guild.name,
      setting as LogSettings,
      config
    );
    await interaction.editReply(
      success
        ? t("commands:log.reset.success", { setting })
        : t("commands:log.reset.failed")
    );
    return;
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "log reset command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "log reset", errorId, t)],
    });
  }
};
