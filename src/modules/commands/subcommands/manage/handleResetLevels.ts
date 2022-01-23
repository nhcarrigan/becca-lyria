/* eslint-disable jsdoc/require-param */
import { GuildMember } from "discord.js";

import LevelModel from "../../../../database/models/LevelModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Deletes the server's level data, resetting everyone's progress.
 */
export const handleResetLevels: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const { guild, member } = interaction;

    if (!guild || !member) {
      await interaction.editReply({
        content: getRandomValue(t("responses:missingGuild")),
      });
      return;
    }

    if (
      !(member as GuildMember).permissions.has("MANAGE_GUILD") &&
      member.user.id !== Becca.configs.ownerId
    ) {
      await interaction.editReply({
        content: getRandomValue(t("responses:noPermission")),
      });
      return;
    }

    const currentLevels = await LevelModel.find({ serverID: guild.id });

    if (!currentLevels || !currentLevels.length) {
      await interaction.editReply({
        content: t("commands:manage.levels.none"),
      });
      return;
    }
    for (const level of currentLevels) {
      await level.delete();
    }
    await interaction.editReply({
      content: t("commands:manage.levels.success"),
    });
    return;
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "reset level command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "reset level", errorId)],
    });
  }
};
