/* eslint-disable jsdoc/require-param */
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
} from "discord.js";

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
        content: getRandomValue(t<string, string[]>("responses:missingGuild")),
      });
      return;
    }
    const serverLevels = await LevelModel.find({
      serverID: guildId,
    })
      .sort({ points: -1 })
      .lean()
      .exec();

    if (!serverLevels || !serverLevels.length) {
      await interaction.editReply({
        content: t<string, string>("commands:community.leaderboard.disabled"),
      });
      return;
    }

    const mapped: [number, string, number, number][] = serverLevels.map(
      (level, index) => [index + 1, level.userTag, level.level, level.points]
    );

    const authorLevel = mapped.find((el) => el[1] === interaction.user.tag);

    const rankString = authorLevel
      ? `You are rank ${authorLevel[0]} at level ${authorLevel[2]} (${authorLevel[3]} XP)`
      : "You have not earned any experience yet!";

    let page = 1;
    const lastPage = Math.ceil(mapped.length / 10);

    const pageBack = new ButtonBuilder()
      .setCustomId("prev")
      .setDisabled(true)
      .setLabel("◀")
      .setStyle(ButtonStyle.Primary);
    const pageForward = new ButtonBuilder()
      .setCustomId("next")
      .setLabel("▶")
      .setStyle(ButtonStyle.Primary);

    if (lastPage <= 1) {
      pageForward.setDisabled(true);
    }

    const levelEmbed = new EmbedBuilder();
    levelEmbed.setTitle(
      t<string, string>("commands:community.leaderboard.title", {
        name: guild.name,
      })
    );
    levelEmbed.setColor(Becca.colours.default);
    levelEmbed.setDescription(
      `\`\`\`\n${formatTextToTable(mapped.slice(page * 10 - 10, page * 10), {
        headers: [
          t<string, string>("commands:community.leaderboard.rank"),
          t<string, string>("commands:community.leaderboard.user"),
          t<string, string>("commands:community.leaderboard.level"),
          t<string, string>("commands:community.leaderboard.xp"),
        ],
      })}\n\`\`\``
    );
    levelEmbed.setTimestamp();
    levelEmbed.setFooter({
      text: t<string, string>("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    const response = await interaction.editReply({
      content: rankString,
      embeds: [levelEmbed],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          pageBack,
          pageForward
        ),
      ],
    });

    const collector =
      response.createMessageComponentCollector<ComponentType.Button>({
        time: 30000,
        filter: (click) => click.user.id === interaction.user.id,
      });

    collector.on("collect", async (click) => {
      await click.deferUpdate();
      if (click.customId === "prev") {
        page--;
      }
      if (click.customId === "next") {
        page++;
      }

      if (page <= 1) {
        pageBack.setDisabled(true);
      } else {
        pageBack.setDisabled(false);
      }

      if (page >= lastPage) {
        pageForward.setDisabled(true);
      } else {
        pageForward.setDisabled(false);
      }

      levelEmbed.setDescription(
        `\`\`\`\n${formatTextToTable(mapped.slice(page * 10 - 10, page * 10), {
          headers: [
            t<string, string>("commands:community.leaderboard.rank"),
            t<string, string>("commands:community.leaderboard.user"),
            t<string, string>("commands:community.leaderboard.level"),
            t<string, string>("commands:community.leaderboard.xp"),
          ],
        })}\n\`\`\``
      );

      await interaction.editReply({
        content: rankString,
        embeds: [levelEmbed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            pageBack,
            pageForward
          ),
        ],
      });
    });

    collector.on("end", async () => {
      pageBack.setDisabled(true);
      pageForward.setDisabled(true);
      await interaction.editReply({
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            pageBack,
            pageForward
          ),
        ],
      });
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
