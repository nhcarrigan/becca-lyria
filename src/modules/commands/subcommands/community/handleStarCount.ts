/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import StarModel from "../../../../database/models/StarModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { formatTextToTable } from "../../../../utils/formatText";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Generates an embed listing the top ten users with the most stars received in the
 * server, and includes the user's rank.
 */
export const handleStarCount: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const { member, guild, guildId } = interaction;

    if (!guild || !member) {
      await interaction.editReply({
        content: getRandomValue(t("responses:missingGuild")),
      });
      return;
    }

    const starCounts = await StarModel.findOne({ serverID: guild.id });

    if (!starCounts || !starCounts.users.length) {
      await interaction.editReply({
        content:
          "It seems no one here is carrying around stars yet. You should probably fix that.",
      });
      return;
    }

    const userStars = starCounts.users.find((u) => u.userID === member.user.id);
    const userRank = starCounts.users.findIndex(
      (u) => u.userID === member.user.id
    );

    const topTen = starCounts.users
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 10);

    const userRankString = userStars
      ? `${member.user.username} is rank ${userRank + 1} with ${
          userStars.stars
        } stars.`
      : `${member.user.username} does not have any stars yet...`;

    const topTenArray = topTen.map((u, index) => [
      index + 1,
      u.userTag,
      u.stars,
    ]);

    const starEmbed = new MessageEmbed();
    starEmbed.setTitle(`Helpful people in ${guild.name}`);
    starEmbed.setColor(Becca.colours.default);
    starEmbed.setDescription(
      `\`\`\`\n${formatTextToTable(topTenArray, {
        headers: ["Rank", "User", "Stars"],
      })}\n\`\`\``
    );
    starEmbed.addField("Your stars", userRankString);
    starEmbed.setTimestamp();
    starEmbed.setURL(`https://dash.beccalyria.com/stars/${guildId}`);
    starEmbed.setFooter(
      "Like the bot? Donate: https://donate.nhcarrigan.com",
      "https://cdn.nhcarrigan.com/profile-transparent.png"
    );

    await interaction.editReply({ embeds: [starEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "star count command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "star count", errorId)],
    });
  }
};
