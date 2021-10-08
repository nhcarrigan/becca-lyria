/* eslint-disable jsdoc/require-jsdoc */
import { SlashCommandBuilder } from "@discordjs/builders";

import { CommandInt } from "../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { handleStats } from "../modules/commands/subcommands/stats/handleStats";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const stats: CommandInt = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Handles bot statistics")
    .addStringOption(
      (option) =>
        option
          .setName("choices")
          .setDescription("The stats you want")
          .addChoice("Command Leaderboard", "commands")
          .setRequired(true)
      // TODO: not sure why I need to cast this?
    ) as SlashCommandBuilder,
  run: async (Becca, interaction, config): Promise<void> => {
    try {
      await interaction.deferReply();
      const subcommand = interaction.options.getSubcommand();
      switch (subcommand) {
        case "commands":
          await handleStats(Becca, interaction, config);
          break;
        default:
          await interaction.editReply({
            content: Becca.responses.invalidCommand,
          });
      }
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "stats group command",
        err,
        interaction.guild?.name
      );
      await interaction
        .reply({
          embeds: [errorEmbedGenerator(Becca, "stats group", errorId)],
          ephemeral: true,
        })
        .catch(
          async () =>
            await interaction.editReply({
              embeds: [errorEmbedGenerator(Becca, "stats group", errorId)],
            })
        );
    }
  },
};
