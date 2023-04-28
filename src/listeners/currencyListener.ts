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
      const earned = Math.floor(Math.random() * 5);

      await Becca.db.currencies.upsert({
        where: {
          userId: target,
        },
        update: {
          currencyTotal: {
            increment: earned,
          },
        },
        create: {
          userId: interaction.user.id,
          currencyTotal: earned,
          dailyClaimed: 0,
          weeklyClaimed: 0,
          monthlyClaimed: 0,
        },
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
