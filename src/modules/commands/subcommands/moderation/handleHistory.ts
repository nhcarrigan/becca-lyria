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
export const handleHistory: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { guild, member } = interaction;
    const target = interaction.options.getUser("target", true);

    if (!guild || !member) {
      await interaction.editReply({
        content: getRandomValue(t("responses:missingGuild")),
      });
      return;
    }
    const targetMember = await guild.members.fetch(target.id);

    if (
      typeof member.permissions === "string" ||
      (!member.permissions.has("KICK_MEMBERS") &&
        !member.permissions.has("BAN_MEMBERS") &&
        !member.permissions.has("MODERATE_MEMBERS")) ||
      !targetMember ||
      typeof targetMember.permissions === "string" ||
      (!targetMember.permissions.has("KICK_MEMBERS") &&
        !targetMember.permissions.has("BAN_MEMBERS") &&
        !targetMember.permissions.has("MODERATE_MEMBERS"))
    ) {
      await interaction.editReply({
        content: getRandomValue(t("responses:noPermission")),
      });
      return;
    }

    const targetRecord = await HistoryModel.findOne({
      serverId: guild.id,
      userId: target.id,
    });

    if (!targetRecord) {
      await interaction.editReply({
        content: t("commands:mod.history.clean"),
      });
      return;
    }

    const embed = new MessageEmbed();
    embed.setTitle(t("commands:mod.history.title", { user: target.tag }));
    embed.setDescription(t("commands:mod.history.description"));
    embed.setColor(Becca.colours.default);
    embed.setThumbnail(target.displayAvatarURL());
    embed.addField(
      t("commands:mod.history.ban"),
      String(targetRecord.bans),
      true
    );
    embed.addField(
      t("commands:mod.history.kick"),
      String(targetRecord.kicks),
      true
    );
    embed.addField(
      t("commands:mod.history.warn"),
      String(targetRecord.warns),
      true
    );
    embed.addField(
      t("commands:mod.history.mute"),
      String(targetRecord.mutes),
      true
    );
    embed.addField(
      t("commands:mod.history.unmute"),
      String(targetRecord.unmutes),
      true
    );

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
      embeds: [errorEmbedGenerator(Becca, "history", errorId, t)],
    });
  }
};
