/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import LevelModel from "../../../../database/models/LevelModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * If the server has enabled the level system, this generates an embed
 * containing the top ten users by experience points, their total XP and level,
 * and the rank of the user who called the command.
 */
export const handleLeaderboard: CommandHandler = async (Becca, interaction) => {
  try {
    const { guildId, guild, user } = interaction;

    if (!guildId || !guild) {
      await interaction.editReply({
        content: getRandomValue(Becca.responses.missingGuild),
      });
      return;
    }
    const serverLevels = await LevelModel.findOne({
      serverID: guildId,
    });

    if (!serverLevels) {
      await interaction.editReply({
        content: "It would appear that rankings are not enabled here.",
      });
      return;
    }

    const authorLevel = serverLevels.users.find((u) => u.userID === user.id);

    const sortedLevels = serverLevels.users.sort((a, b) => b.points - a.points);

    const authorRank = authorLevel
      ? `${user.tag} is rank ${
          sortedLevels.findIndex((u) => u.userID === user.id) + 1
        }`
      : `${user.tag} is not ranked yet...`;

    const topTen = sortedLevels
      .slice(0, 10)
      .map(
        (u, index) =>
          `#${index + 1}: ${u.userTag} at level ${u.level} with ${
            u.points
          } experience points.`
      );

    const levelEmbed = new MessageEmbed();
    levelEmbed.setTitle(`${guild.name} leaderboard`);
    levelEmbed.setColor(Becca.colours.default);
    levelEmbed.addField("Top ten members", topTen.join("\n"));
    levelEmbed.addField("Your rank", authorRank);
    levelEmbed.setTimestamp();
    levelEmbed.setURL(`https://dash.beccalyria.com/leaderboard/${guildId}`);
    await interaction.editReply({
      embeds: [levelEmbed],
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "leaderboard command",
      err,
      interaction.guild?.name
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "leaderboard", errorId)],
    });
  }
};
