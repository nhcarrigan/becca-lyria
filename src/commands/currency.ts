/* eslint-disable jsdoc/require-jsdoc */
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";

import { CurrencyOptOut } from "../config/optout/CurrencyOptOut";
import CurrencyModel from "../database/models/CurrencyModel";
import { Command } from "../interfaces/commands/Command";
import { CurrencyHandler } from "../interfaces/commands/CurrencyHandler";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

import { handleAbout } from "./subcommands/currency/handleAbout";
import { handleClaim } from "./subcommands/currency/handleClaim";
import { handleDaily } from "./subcommands/currency/handleDaily";
import { handleGuess } from "./subcommands/currency/handleGuess";
import { handleSlots } from "./subcommands/currency/handleSlots";
import { handleTwentyOne } from "./subcommands/currency/handleTwentyOne";
import { handleView } from "./subcommands/currency/handleView";
import { handleWeekly } from "./subcommands/currency/handleWeekly";
import { handleInvalidSubcommand } from "./subcommands/handleInvalidSubcommand";

const handlers: { [key: string]: CurrencyHandler } = {
  daily: handleDaily,
  weekly: handleWeekly,
  view: handleView,
  claim: handleClaim,
  about: handleAbout,
  slots: handleSlots,
  "21": handleTwentyOne,
  guess: handleGuess,
};

export const currency: Command = {
  data: new SlashCommandBuilder()
    .setName("currency")
    .setDescription("Handles Becca's economy system.")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("daily")
        .setDescription("Claim your daily currency.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("weekly")
        .setDescription("Claim your weekly currency.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("view")
        .setDescription("View your current balance and cooldowns.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("claim")
        .setDescription("Claim a reward with your currency!")
        .addStringOption((option) =>
          option
            .setName("reward")
            .setDescription("The reward you want to claim.")
            .addChoices([
              [
                "Steal the `Monarch` role in Becca's Discord server. (1000 BeccaCoin)",
                "monarch",
              ],
              [
                "Steal the `Monarch (custom)` role in Becca's Discord server. (5000 BeccaCoin)",
                "custom-monarch",
              ],
              [
                "Claim a special `Wealthy` role in Becca's Discord server! (10000 BeccaCoin)",
                "wealthy",
              ],
              [
                "Claim a special `Wealthy (custom)` role in Becca's Discord server! (25000 BeccaCoin)",
                "custom-wealthy",
              ],
            ])
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("about")
        .setDescription("Explains how the currency system works.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("slots")
        .setDescription("Play slots with Becca!")
        .addIntegerOption((option) =>
          option
            .setName("wager")
            .setDescription("The amount of BeccaCoin you would like to wager.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("21")
        .setDescription("Play a round of 21 against Becca!")
        .addIntegerOption((option) =>
          option
            .setName("wager")
            .setDescription("The amount of BeccaCoin you would like to wager.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("guess")
        .setDescription("Play a guess the number game with Becca.")
        .addIntegerOption((option) =>
          option
            .setName("wager")
            .setDescription("The amount of BeccaCoin you would like to wager.")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("guess")
            .setDescription("Your guess (Choose between 1 and 100!)")
            .setRequired(true)
        )
    ),
  run: async (Becca, interaction, t) => {
    try {
      await interaction.deferReply();

      if (CurrencyOptOut.includes(interaction.user.id)) {
        await interaction.editReply(
          "You have opted out of the currency system and cannot use these commands."
        );
        return;
      }

      const userData =
        (await CurrencyModel.findOne({ userId: interaction.user.id })) ||
        (await CurrencyModel.create({
          userId: interaction.user.id,
          currencyTotal: 0,
          dailyClaimed: 0,
          weeklyClaimed: 0,
          monthlyClaimed: 0,
          slotsPlayed: 0,
          twentyOnePlayed: 0,
        }));

      const subcommand = interaction.options.getSubcommand();
      const handler = handlers[subcommand] || handleInvalidSubcommand;
      await handler(Becca, interaction, t, userData);
      Becca.pm2.metrics.commands.mark();
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "currency group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "currency group", errorId, t)],
      });
    }
  },
};
