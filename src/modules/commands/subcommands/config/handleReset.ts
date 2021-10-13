/* eslint-disable jsdoc/require-param */
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { Settings } from "../../../../interfaces/settings/Settings";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";
import { resetSetting } from "../../../settings/resetSetting";

/**
 * Resets the given `setting` to the default value.
 */
export const handleReset: CommandHandler = async (
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
        ? `I have reset your ${setting} setting.`
        : "I am having trouble updating your settings. Please try again later."
    );
    return;
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "reset command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "reset", errorId)],
        ephemeral: true,
      })
      .catch(async () => {
        await interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "reset", errorId)],
        });
      });
  }
};
