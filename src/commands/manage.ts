/* eslint-disable jsdoc/require-jsdoc */
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";

import { Command } from "../interfaces/commands/Command";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { handleResetLevels } from "../modules/commands/subcommands/manage/handleResetLevels";
import { handleResetStars } from "../modules/commands/subcommands/manage/handleResetStars";
import { handleSuggestion } from "../modules/commands/subcommands/manage/handleSuggestion";
import { handleXpModify } from "../modules/commands/subcommands/manage/handleXpModify";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { getRandomValue } from "../utils/getRandomValue";

export const manage: Command = {
  data: new SlashCommandBuilder()
    .setName("manage")
    .setDescription("Commands for managing your server.")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("resetlevels")
        .setDescription("Reset the leaderboard for your server.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("resetstars")
        .setDescription("Reset the star counts for your server.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("suggestion")
        .setDescription("Approve or deny a suggestion.")
        .addStringOption((option) =>
          option
            .setName("action")
            .setDescription("The action to take on the suggestion.")
            .addChoice("approve", "approve")
            .addChoice("deny", "deny")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The message id of the suggestion to update.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for approving/denying the suggestion.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("xpmodify")
        .setDescription("Award or Remove experience.")
        .addStringOption((option) =>
          option
            .setName("action")
            .setDescription("The action you want to take with the xp.")
            .addChoice("add", "add")
            .addChoice("remove", "remove")
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to modify.")
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("adjustment")
            .setDescription("Amount to adjust the XP by.")
            .setRequired(true)
        )
    ),
  run: async (Becca, interaction, t, config) => {
    try {
      await interaction.deferReply();

      const subCommand = interaction.options.getSubcommand();

      switch (subCommand) {
        case "resetlevels":
          await handleResetLevels(Becca, interaction, t, config);
          break;
        case "resetstars":
          await handleResetStars(Becca, interaction, t, config);
          break;
        case "suggestion":
          await handleSuggestion(Becca, interaction, t, config);
          break;
        case "xpmodify":
          await handleXpModify(Becca, interaction, t, config);
          break;
        default:
          await interaction.editReply({
            content: getRandomValue(t("responses:invalidCommand")),
          });
          break;
      }
      Becca.pm2.metrics.commands.mark();
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "manage group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "manage group", errorId)],
      });
    }
  },
};
