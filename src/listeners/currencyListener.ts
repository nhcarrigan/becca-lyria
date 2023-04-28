/*eslint-disable jsdoc/require-jsdoc*/
import { CommandInteraction } from "discord.js";

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

      const data = await Becca.db.currencies.upsert({
        where: {
          userId: target,
        },
        update: {},
        create: {
          userId: interaction.user.id,
          currencyTotal: 0,
          dailyClaimed: 0,
          weeklyClaimed: 0,
          monthlyClaimed: 0,
        },
      });

      const earned = Math.floor(Math.random() * 5);

      data.currencyTotal += earned;

      await Becca.db.currencies.update({
        where: {
          userId: target,
        },
        data,
      });
    } catch (err) {
      await beccaErrorHandler(
        Becca,
        "currency listener",
        err,
        interaction.guild?.name
      );
    }
  },
};
