/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { LogSettings } from "../../../../interfaces/settings/LogSettings";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../../utils/customSubstring";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";
import { renderSetting } from "../../../settings/renderSetting";
import { setSetting } from "../../../settings/setSetting";
import { validateSetting } from "../../../settings/validateSetting";

/**
 * Provided the `value` is valid, sets the given `setting` to that `value`.
 */
export const handleLogSet: CommandHandler = async (
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
    const value = interaction.options.getChannel("channel");
    if (!value) {
      await interaction.editReply(
        "Not sure how, but you managed to forget the value!"
      );
      return;
    }

    const isValid = await validateSetting(
      Becca,
      setting as LogSettings,
      value.id,
      guild,
      config
    );
    if (!isValid) {
      await interaction.editReply(
        `${value} is not a valid option for ${setting}.`
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
      await interaction.editReply(
        "I am having trouble updating your settings. Please try again later."
      );
      return;
    }
    const newContent = isSet[setting as LogSettings];
    const parsedContent = await renderSetting(
      Becca,
      setting as LogSettings,
      newContent
    );
    const successEmbed = new MessageEmbed();
    successEmbed.setTitle(`${setting} Updated`);
    successEmbed.setDescription(customSubstring(parsedContent, 2000));
    successEmbed.setTimestamp();
    successEmbed.setColor(Becca.colours.default);
    await interaction.editReply({ embeds: [successEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "log set command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "log set", errorId)],
        ephemeral: true,
      })
      .catch(async () => {
        await interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "log set", errorId)],
        });
      });
  }
};
