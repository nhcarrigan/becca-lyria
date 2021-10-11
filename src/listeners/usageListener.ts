/* eslint-disable jsdoc/require-jsdoc */
import { CommandInteraction } from "discord.js";

import UsageModel from "../database/models/UsageModel";
import { BeccaLyria } from "../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

/**
 * Tracks anonymous slash command usage to see which are popular
 * and which are unused.
 */
export const usageListener = {
  name: "usage",
  description: "Tracks command usage.",
  run: async (
    Becca: BeccaLyria,
    interaction: CommandInteraction
  ): Promise<void> => {
    try {
      const command = interaction.commandName;
      const subcommand = interaction.options.getSubcommand();

      const data =
        (await UsageModel.findOne({ command, subcommand })) ||
        (await UsageModel.create({ command, subcommand, uses: 0 }));

      data.uses++;
      await data.save();
    } catch (err) {
      beccaErrorHandler(Becca, "thanks listener", err, interaction.guild?.name);
    }
  },
};
