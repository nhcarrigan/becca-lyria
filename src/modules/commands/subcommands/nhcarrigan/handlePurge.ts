/* eslint-disable jsdoc/require-param */
import ActivityModel from "../../../../database/models/ActivityModel";
import CurrencyModel from "../../../../database/models/CurrencyModel";
import LevelModel from "../../../../database/models/LevelModel";
import StarModel from "../../../../database/models/StarModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Purges the given `data` type for the provided `user`. Use this when a user
 * has requested data deletion or opt out.
 */
export const handlePurge: CommandHandler = async (Becca, interaction) => {
  try {
    const user = interaction.options.getString("user", true);
    const target = interaction.options.getString("data");

    if (target === "levels") {
      const levels = await LevelModel.find({});
      for (const datum of levels) {
        const index = datum.users.findIndex((u) => u.userID === user);
        if (index !== -1) {
          datum.users.splice(index, 1);
          datum.markModified("users");
          await datum.save();
        }
      }
      await interaction.editReply("I have cleared that user's level data.");
      return;
    }

    if (target === "activity") {
      const activity = await ActivityModel.findOne({ userId: user });
      if (activity) {
        await activity.delete();
      }
      await interaction.editReply("I have cleared that user's activity data.");
      return;
    }

    if (target === "stars") {
      const stars = await StarModel.find({});
      for (const datum of stars) {
        const index = datum.users.findIndex((u) => u.userID === user);
        if (index !== -1) {
          datum.users.splice(index, 1);
          datum.markModified("users");
          await datum.save();
        }
      }
      await interaction.editReply("I have cleared that user's star data.");
      return;
    }

    if (target === "currency") {
      const currency = await CurrencyModel.findOne({ userId: user });
      if (currency) {
        await currency.delete();
      }
      await interaction.editReply("I have cleared that user's currency data.");
      return;
    }
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "purge command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "purge", errorId)],
        ephemeral: true,
      })
      .catch(async () => {
        await interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "purge", errorId)],
        });
      });
  }
};
