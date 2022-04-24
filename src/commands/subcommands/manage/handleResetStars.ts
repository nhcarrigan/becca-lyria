/* eslint-disable jsdoc/require-param */
import { GuildMember } from "discord.js";

import StarModel from "../../../database/models/StarModel";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Deletes the server's star counts, resetting everyone's progress.
 */
export const handleResetStars: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const { member, guild } = interaction;

    if (!guild || !member) {
      await interaction.editReply({
        content: getRandomValue(t("responses:missingGuild")),
      });
      return;
    }

    if (!(member as GuildMember).permissions.has("MANAGE_GUILD")) {
      await interaction.editReply({
        content: getRandomValue(t("responses:noPermission")),
      });
      return;
    }

    const starData = await StarModel.findOne({ serverID: guild.id });

    if (!starData) {
      await interaction.editReply({
        content: t("commands:manage.stars.none"),
      });
      return;
    }

    starData.users = [];
    starData.markModified("users");
    await starData.save();
    await interaction.editReply({
      content: t("commands:manage.stars.success"),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "reset stars command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "reset stars", errorId, t)],
    });
  }
};
