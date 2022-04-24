/* eslint-disable jsdoc/require-param */
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

import LevelModel from "../../../database/models/LevelModel";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { generateLevelHtml } from "../../../modules/commands/community/generateLevelHtml";
import { generateLevelImage } from "../../../modules/commands/community/generateLevelImage";

/**
 * Returns the current level ranking information for the given `user-level` or the author.
 * Does not work if levels are disabled.
 */
export const handleLevel: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { guildId, guild, user } = interaction;

    if (!guildId || !guild) {
      await interaction.editReply({
        content: getRandomValue(t("responses:missingGuild")),
      });
      return;
    }

    const target = interaction.options.getUser("user-level") || user;

    const targetLevel = await LevelModel.findOne({
      serverID: guildId,
      userID: target.id,
    });

    if (!targetLevel) {
      await interaction.editReply({
        content: t("commands:community.level.none", {
          user: `<@!${target.id}>`,
        }),
      });
      return;
    }

    const levelCardHtml = await generateLevelHtml(target, targetLevel);
    const levelCardImage = await generateLevelImage(levelCardHtml);

    const levelEmbed = new MessageEmbed();
    levelEmbed.setColor(Becca.colours.default);
    levelEmbed.setTitle(
      t("commands:community.level.title", { user: target.tag })
    );
    levelEmbed.setDescription(
      t("commands:community.level.description", { name: guild.name })
    );
    levelEmbed.addField(
      t("commands:community.level.points"),
      targetLevel.points.toString(),
      true
    );
    levelEmbed.addField(
      t("commands:community.level.level"),
      targetLevel.level.toString(),
      true
    );
    levelEmbed.addField(
      t("commands:community.level.seen"),
      `${new Date(targetLevel.lastSeen).toLocaleDateString()}`
    );
    levelEmbed.setTimestamp();
    levelEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
    });
    levelEmbed.setImage("attachment://level.png");

    const button = new MessageButton()
      .setLabel(t("commands:community.level.buttons.view"))
      .setEmoji("<:BeccaCheer:897545794176045096>")
      .setStyle("LINK")
      .setURL(
        `https://dash.beccalyria.com/leaderboard/${guildId}?utm_source=discord&utm_medium=level-command`
      );
    const row = new MessageActionRow().addComponents([button]);

    await interaction.editReply({
      embeds: [levelEmbed],
      components: [row],
      files: [levelCardImage],
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "level command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "level", errorId, t)],
    });
  }
};
