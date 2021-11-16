/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { renderSetting } from "../../../settings/renderSetting";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Handles viewing the log settings.
 */
export const handleLogView: CommandHandler = async (
  Becca,
  interaction,
  config
) => {
  try {
    const { guild } = interaction;

    if (!guild) {
      await interaction.editReply({
        content: getRandomValue(Becca.responses.missingGuild),
      });
      return;
    }

    const settingEmbed = new MessageEmbed();
    settingEmbed.setColor(Becca.colours.default);
    settingEmbed.setTitle(`Log Settings for ${guild.name}`);
    settingEmbed.addField(
      "Message Events",
      renderSetting(Becca, "message_events", config.message_events)
    );
    settingEmbed.addField(
      "Voice Events",
      renderSetting(Becca, "voice_events", config.voice_events)
    );
    settingEmbed.addField(
      "Thread Events",
      renderSetting(Becca, "thread_events", config.thread_events)
    );
    settingEmbed.addField(
      "Moderation Events",
      renderSetting(Becca, "moderation_events", config.moderation_events)
    );
    settingEmbed.addField(
      "Member Events",
      renderSetting(Becca, "member_events", config.member_events)
    );
    settingEmbed.setFooter(
      "Like the bot? Donate: https://donate.nhcarrigan.com"
    );

    await interaction.editReply({ embeds: [settingEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "log view command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "log view", errorId)],
    });
  }
};
