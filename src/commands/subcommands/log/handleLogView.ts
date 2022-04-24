/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";
import { renderSetting } from "../../../modules/settings/renderSetting";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";

/**
 * Handles viewing the log settings.
 */
export const handleLogView: CommandHandler = async (
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

    const settingEmbed = new MessageEmbed();
    settingEmbed.setColor(Becca.colours.default);
    settingEmbed.setTitle(t("commands:log.view.title", { name: guild.name }));
    settingEmbed.addField(
      t("commands:log.view.message"),
      renderSetting(Becca, "message_events", config.message_events)
    );
    settingEmbed.addField(
      t("commands:log.view.voice"),
      renderSetting(Becca, "voice_events", config.voice_events)
    );
    settingEmbed.addField(
      t("commands:log.view.thread"),
      renderSetting(Becca, "thread_events", config.thread_events)
    );
    settingEmbed.addField(
      t("commands:log.view.mod"),
      renderSetting(Becca, "moderation_events", config.moderation_events)
    );
    settingEmbed.addField(
      t("commands:log.view.member"),
      renderSetting(Becca, "member_events", config.member_events)
    );
    settingEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
    });

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
      embeds: [errorEmbedGenerator(Becca, "log view", errorId, t)],
    });
  }
};
