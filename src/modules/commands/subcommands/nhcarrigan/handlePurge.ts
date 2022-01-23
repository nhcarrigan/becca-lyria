/* eslint-disable jsdoc/require-param */
import ActivityModel from "../../../../database/models/ActivityModel";
import CommandCountModel from "../../../../database/models/CommandCountModel";
import CurrencyModel from "../../../../database/models/CurrencyModel";
import EmoteCountModel from "../../../../database/models/EmoteCountModel";
import LevelModel from "../../../../database/models/LevelModel";
import StarModel from "../../../../database/models/StarModel";
import VoterModel from "../../../../database/models/VoterModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Purges the given `data` type for the provided `user`. Use this when a user
 * has requested data deletion or opt out.
 */
export const handlePurge: CommandHandler = async (Becca, interaction, t) => {
  try {
    const target = interaction.options.getString("target", true);
    const data = interaction.options.getString("data");
    let name = t("commands:nhcarrigan.purge.no");

    if (data === "levels") {
      const levels = await LevelModel.find({ userID: target });
      for (const datum of levels) {
        await datum.delete();
        name = datum.userTag;
      }
      await interaction.editReply(
        t("commands:nhcarrigan.purge,levels", { name })
      );
      return;
    }

    if (data === "activity") {
      const activity = await ActivityModel.findOne({ userId: target });
      if (activity) {
        await activity.delete();
        name = activity.userId;
      }
      await interaction.editReply(
        t("commands:nhcarrigan.purge.activity", { name })
      );
      return;
    }

    if (data === "stars") {
      const stars = await StarModel.find({});
      for (const datum of stars) {
        const index = datum.users.findIndex((u) => u.userID === target);
        if (index !== -1) {
          name = datum.users[index].userTag;
          datum.users.splice(index, 1);
          datum.markModified("users");
          await datum.save();
        }
      }
      await interaction.editReply(
        t("commands:nhcarrigan.purge.stars", { name })
      );
      return;
    }

    if (data === "currency") {
      const currency = await CurrencyModel.findOne({ userId: target });
      if (currency) {
        name = currency.userId;
        await currency.delete();
      }
      await interaction.editReply(
        t("commands:nhcarrigan.purge.currency", { name })
      );
      return;
    }

    if (data === "votes") {
      const votes = await VoterModel.findOne({ userId: target });
      if (votes) {
        name = votes.userId;
        await votes.delete();
      }
      await interaction.editReply(
        t("commands:nhcarrigan.purge.votes", { name })
      );
      return;
    }

    if (data === "commands") {
      const commands = await CommandCountModel.findOne({ serverId: target });
      if (commands) {
        name = commands.serverName;
        await commands.delete();
      }
      await interaction.editReply(
        t("commands:nhcarrigan.purge.commands", { name })
      );
      return;
    }

    if (data === "emotes") {
      const emotes = await EmoteCountModel.findOne({ userId: target });
      if (emotes) {
        name = emotes.userName;
        await emotes.delete();
      }
      await interaction.editReply(
        t("commands:nhcarrigan.purge.emotes", { name })
      );
      return;
    }

    await interaction.editReply(
      t("commands:nhcarrigan.purge.invalid", { data })
    );
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "purge command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "purge", errorId, t)],
    });
  }
};
