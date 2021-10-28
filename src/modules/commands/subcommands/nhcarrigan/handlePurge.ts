/* eslint-disable jsdoc/require-param */
import ActivityModel from "../../../../database/models/ActivityModel";
import CommandCountModel from "../../../../database/models/CommandCountModel";
import CurrencyModel from "../../../../database/models/CurrencyModel";
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
export const handlePurge: CommandHandler = async (Becca, interaction) => {
  try {
    const target = interaction.options.getString("target", true);
    const data = interaction.options.getString("data");
    let name = "`no data found!`";

    if (data === "levels") {
      const levels = await LevelModel.find({});
      for (const datum of levels) {
        const index = datum.users.findIndex((u) => u.userID === target);
        if (index !== -1) {
          name = datum.users[index].userTag;
          datum.users.splice(index, 1);
          datum.markModified("users");
          await datum.save();
        }
      }
      await interaction.editReply(`I have cleared the level data for ${name}.`);
      return;
    }

    if (data === "activity") {
      const activity = await ActivityModel.findOne({ userId: target });
      if (activity) {
        await activity.delete();
        name = activity.userId;
      }
      await interaction.editReply(
        `I have cleared the activity data for ${name}.`
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
      await interaction.editReply(`I have cleared star data for ${name}.`);
      return;
    }

    if (data === "currency") {
      const currency = await CurrencyModel.findOne({ userId: target });
      if (currency) {
        name = currency.userId;
        await currency.delete();
      }
      await interaction.editReply(
        `I have cleared the currency data for ${name}.`
      );
      return;
    }

    if (data === "votes") {
      const votes = await VoterModel.findOne({ userId: target });
      if (votes) {
        name = votes.userId;
        await votes.delete();
      }
      await interaction.editReply(`I have cleared the vote data for ${name}.`);
      return;
    }

    if (data === "commands") {
      const commands = await CommandCountModel.findOne({ serverId: target });
      if (commands) {
        name = commands.serverName;
        await commands.delete();
      }
      await interaction.editReply(
        `I have cleared the command data for ${name}.`
      );
      return;
    }
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
      embeds: [errorEmbedGenerator(Becca, "purge", errorId)],
    });
  }
};
