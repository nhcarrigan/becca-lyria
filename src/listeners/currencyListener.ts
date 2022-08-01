/*eslint-disable jsdoc/require-jsdoc*/
import { CommandInteraction } from "discord.js";

import CurrencyModel from "../database/models/CurrencyModel";
import { BeccaLyria } from "../interfaces/BeccaLyria";
import { getOptOutRecord } from "../modules/listeners/getOptOutRecord";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

/**
 * Tracks slash command interactions, awards currency for each
 * command use.
 */
export const currencyListener = {
  name: "currency",
  description: "Awards currency on command usage.",
  run: async (
    Becca: BeccaLyria,
    interaction: CommandInteraction
  ): Promise<void> => {
    try {
      const { user } = interaction;
      const target = user.id;

      const optout = await getOptOutRecord(Becca, target);

      if (!optout || optout.currency) {
        return;
      }

      const data =
        (await CurrencyModel.findOne({ discordId: target })) ||
        (await CurrencyModel.create({
          userId: interaction.user.id,
          currencyTotal: 0,
          dailyClaimed: 0,
          weeklyClaimed: 0,
          monthlyClaimed: 0,
        }));

      const earned = Math.floor(Math.random() * 5);

      data.currencyTotal += earned;
      await data.save();
    } catch (err) {
      await beccaErrorHandler(
        Becca,
        "thanks listener",
        err,
        interaction.guild?.name
      );
    }
  },
};
