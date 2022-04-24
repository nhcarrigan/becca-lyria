/* eslint-disable jsdoc/require-param */
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

import LevelModel from "../../../database/models/LevelModel";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { formatTextToTable } from "../../../utils/formatText";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * If the server has enabled the level system, this generates an embed
 * containing the top ten users by experience points, their total XP and level,
 * and the rank of the user who called the command.
 */
export const handleLeaderboard: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const { guildId, guild } = interaction;

    if (!guildId || !guild) {
      await interaction.editReply({
        content: getRandomValue(t("responses:missingGuild")),
      });
      return;
    }
    const serverLevels = await LevelModel.find({
      serverID: guildId,
    })
      .sort({ points: -1 })
      .limit(10)
      .lean()
      .exec();

    if (!serverLevels || !serverLevels.length) {
      await interaction.editReply({
        content: t("commands:community.leaderboard.disabled"),
      });
      return;
    }

    const topTen = serverLevels.map((u, index) => [
      index + 1,
      u.userTag,
      u.level,
      u.points,
    ]);

    const levelEmbed = new MessageEmbed();
    levelEmbed.setTitle(
      t("commands:community.leaderboard.title", { name: guild.name })
    );
    levelEmbed.setColor(Becca.colours.default);
    levelEmbed.setDescription(
      `\`\`\`\n${formatTextToTable(topTen, {
        headers: [
          t("commands:community.leaderboard.rank"),
          t("commands:community.leaderboard.user"),
          t("commands:community.leaderboard.level"),
          t("commands:community.leaderboard.xp"),
        ],
      })}\n\`\`\``
    );
    levelEmbed.setTimestamp();
    levelEmbed.setURL(
      `https://dash.beccalyria.com/leaderboard/${guildId}?utm_source=discord&utm_medium=leaderboard-command`
    );
    levelEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
    });

    const button = new MessageButton()
      .setLabel(t("commands:community.leaderboard.buttons.view"))
      .setEmoji("<:BeccaCheer:897545794176045096>")
      .setStyle("LINK")
      .setURL(
        `https://dash.beccalyria.com/leaderboard/${guildId}?utm_source=discord&utm_medium=leaderboard-command`
      );
    const row = new MessageActionRow().addComponents([button]);

    await interaction.editReply({
      embeds: [levelEmbed],
      components: [row],
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "leaderboard command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "leaderboard", errorId, t)],
    });
  }
};
