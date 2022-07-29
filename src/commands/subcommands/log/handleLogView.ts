/* eslint-disable jsdoc/require-param */
import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { renderSetting } from "../../../modules/settings/renderSetting";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

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

    const settingEmbed = new EmbedBuilder();
    settingEmbed.setColor(Becca.colours.default);
    settingEmbed.setTitle(t("commands:log.view.title", { name: guild.name }));
    settingEmbed.addFields([
      {
        name: t("commands:log.view.message"),
        value: renderSetting(Becca, "message_events", config.message_events),
      },
      {
        name: t("commands:log.view.voice"),
        value: renderSetting(Becca, "voice_events", config.voice_events),
      },
      {
        name: t("commands:log.view.thread"),
        value: renderSetting(Becca, "thread_events", config.thread_events),
      },
      {
        name: t("commands:log.view.mod"),
        value: renderSetting(
          Becca,
          "moderation_events",
          config.moderation_events
        ),
      },
      {
        name: t("commands:log.view.member"),
        value: renderSetting(Becca, "member_events", config.member_events),
      },
    ]);
    settingEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
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
