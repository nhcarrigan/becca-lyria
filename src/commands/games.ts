/* eslint-disable jsdoc/require-jsdoc */
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";

import { Command } from "../interfaces/commands/Command";
import { CommandHandler } from "../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

import { handleFact } from "./subcommands/games/handleFact";
import { handleHabitica } from "./subcommands/games/handleHabitica";
import { handleMtg } from "./subcommands/games/handleMtg";
import { handleSlime } from "./subcommands/games/handleSlime";
import { handleSus } from "./subcommands/games/handleSus";
import { handleTrivia } from "./subcommands/games/handleTrivia";
import { handleInvalidSubcommand } from "./subcommands/handleInvalidSubcommand";

const handlers: { [key: string]: CommandHandler } = {
  fact: handleFact,
  mtg: handleMtg,
  sus: handleSus,
  trivia: handleTrivia,
  slime: handleSlime,
  habitica: handleHabitica,
};

export const games: Command = {
  data: new SlashCommandBuilder()
    .setName("games")
    .setDescription("Fun and silly commands!")
    .setDMPermission(false)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("fact")
        .setDescription("Provides a random fun fact.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("mtg")
        .setDescription(
          "Searches for information on a Magic: The Gathering card."
        )
        .addStringOption((option) =>
          option
            .setName("card")
            .setDescription("The name of the card you want to search for")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("sus")
        .setDescription("Identifies the next impostor")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("trivia")
        .setDescription("Plays a quick trivia game with you!")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("slime")
        .setDescription("Gives you a slime name!")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("habitica")
        .setDescription("Returns information on a Habitica user.")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("Example: 285a3335-33b9-473f-8d80-085c04f207bc")
            .setRequired(true)
        )
    ),
  run: async (Becca, interaction, t, config) => {
    try {
      await interaction.deferReply();

      const subCommand = interaction.options.getSubcommand();
      const handler = handlers[subCommand] || handleInvalidSubcommand;
      await handler(Becca, interaction, t, config);
      Becca.pm2.metrics.commands.mark();
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "games group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "games group", errorId, t)],
      });
    }
  },
};
