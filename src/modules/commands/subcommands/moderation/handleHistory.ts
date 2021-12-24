/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import HistoryModel from "../../../../database/models/HistoryModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Fetches a user's moderation history from the database and parses it for display.
 */
export const handleHistory: CommandHandler = async (Becca, interaction) => {
  try {
    const { guild, member } = interaction;
    const target = interaction.options.getUser("target", true);

    if (!guild || !member) {
      await interaction.editReply({
        content: getRandomValue(Becca.responses.missingGuild),
      });
      return;
    }

    if (
      typeof member.permissions === "string" ||
      (!member.permissions.has("KICK_MEMBERS") &&
        !member.permissions.has("BAN_MEMBERS") &&
        !member.permissions.has("MODERATE_MEMBERS"))
    ) {
      await interaction.editReply({
        content: getRandomValue(Becca.responses.noPermission),
      });
      return;
    }

    const targetRecord = await HistoryModel.findOne({
      serverId: guild.id,
      userId: target.id,
    });

    if (!targetRecord) {
      await interaction.editReply({
        content: "That user is absolutely squeaky clean!",
      });
      return;
    }

    const embed = new MessageEmbed();
    embed.setTitle(`${target.tag}'s history`);
    embed.setDescription("Here are the actions taken against this member.");
    embed.setColor(Becca.colours.default);
    embed.setThumbnail(target.displayAvatarURL());
    embed.addField("Bans", String(targetRecord.bans), true);
    embed.addField("Kicks", String(targetRecord.kicks), true);
    embed.addField("Warnings", String(targetRecord.warns), true);
    embed.addField("Mutes", String(targetRecord.mutes), true);
    embed.addField("Unmutes", String(targetRecord.unmutes), true);

    await interaction.editReply({
      embeds: [embed],
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "history command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "history", errorId)],
    });
  }
};
