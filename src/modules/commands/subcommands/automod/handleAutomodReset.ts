/* eslint-disable jsdoc/require-param */
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { AutomodSettings } from "../../../../interfaces/settings/AutomodSettings";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";
import { resetSetting } from "../../../settings/resetSetting";

/**
 * Resets the given `setting` to the default value.
 */
export const handleAutomodReset: CommandHandler = async (
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
      setting as AutomodSettings,
      config
    );
    await interaction.editReply(
      success
        ? t("commands:automod.reset.success", { setting })
        : t("commands:automod.reset.failure")
    );
    return;
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "automod reset command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "automod reset", errorId)],
    });
  }
};
