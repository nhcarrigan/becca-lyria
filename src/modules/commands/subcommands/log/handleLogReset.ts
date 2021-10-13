/* eslint-disable jsdoc/require-param */
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { LogSettings } from "../../../../interfaces/settings/LogSettings";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { resetSetting } from "../../../settings/resetSetting";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Resets the given `setting` to the default value.
 */
export const handleLogReset: CommandHandler = async (
  Becca,
  interaction,
  config
) => {
  try {
    const { guild } = interaction;

    if (!guild) {
      await interaction.editReply({ content: Becca.responses.missingGuild });
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
        ? `I have reset your ${setting} setting.`
        : "I am having trouble updating your settings. Please try again later."
    );
    return;
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "log reset command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "log reset", errorId)],
        ephemeral: true,
      })
      .catch(async () => {
        await interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "log reset", errorId)],
        });
      });
  }
};
