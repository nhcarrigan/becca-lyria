/* eslint-disable jsdoc/require-jsdoc */
import {
  SlashCommandBuilder,
  SlashCommandRoleOption,
  SlashCommandSubcommandBuilder,
  SlashCommandUserOption,
} from "@discordjs/builders";

import { Command } from "../interfaces/commands/Command";
import { CommandHandler } from "../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

import { handleLeaderboard } from "./subcommands/community/handleLeaderboard";
import { handleLevel } from "./subcommands/community/handleLevel";
import { handleMotivation } from "./subcommands/community/handleMotivation";
import { handlePoll } from "./subcommands/community/handlePoll";
import { handleRole } from "./subcommands/community/handleRole";
import { handleSchedule } from "./subcommands/community/handleSchedule";
import { handleServer } from "./subcommands/community/handleServer";
import { handleStar } from "./subcommands/community/handleStar";
import { handleStarCount } from "./subcommands/community/handleStarCount";
import { handleSuggest } from "./subcommands/community/handleSuggest";
import { handleTopic } from "./subcommands/community/handleTopic";
import { handleUserInfo } from "./subcommands/community/handleUserInfo";
import { handleInvalidSubcommand } from "./subcommands/handleInvalidSubcommand";

const handlers: { [key: string]: CommandHandler } = {
  leaderboard: handleLeaderboard,
  level: handleLevel,
  role: handleRole,
  motivation: handleMotivation,
  schedule: handleSchedule,
  star: handleStar,
  starcount: handleStarCount,
  topic: handleTopic,
  userinfo: handleUserInfo,
  server: handleServer,
  suggest: handleSuggest,
  poll: handlePoll,
};

export const community: Command = {
  data: new SlashCommandBuilder()
    .setName("community")
    .setDescription("Handles community-related features")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("leaderboard")
        .setDescription(
          "Shows the community leaderboard if levels are enabled in this server."
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("level")
        .setDescription(
          "Returns your level in the server, or the user's level that you mention."
        )
        .addUserOption(
          new SlashCommandUserOption()
            .setName("user-level")
            .setDescription("User to find the level for")
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("role")
        .setDescription("Add or remove a self-assignable role to yourself")
        .addRoleOption(
          new SlashCommandRoleOption()
            .setName("role")
            .setDescription("The role to assign")
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("motivation")
        .setDescription("Sends you a little motivational quote.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("schedule")
        .setDescription("Schedules a post to be sent at a later time.")
        .addIntegerOption((option) =>
          option
            .setName("time")
            .setDescription(
              "The time to wait before sending the post, in minutes."
            )
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to send the notification in.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("The message to send.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("star")
        .setDescription("Gives a user a gold star!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to give a star to.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for giving the user a star.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("starcount")
        .setDescription(
          "Returns the leaderboard for users who have received stars."
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("topic")
        .setDescription("Provides a conversation starter!")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("userinfo")
        .setDescription("Returns information on the user, or yourself.")
        .addUserOption((option) =>
          option.setName("user").setDescription("The user to lookup.")
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("server")
        .setDescription("Returns details on the server.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("suggest")
        .setDescription("Generate a suggestion for the server.")
        .addStringOption((option) =>
          option
            .setName("suggestion")
            .setDescription("The suggestion you want to submit.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("poll")
        .setDescription("Create a poll.")
        .addStringOption((option) =>
          option
            .setName("question")
            .setDescription("The question to ask in the poll.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("a").setDescription("Option A").setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("b").setDescription("Option B").setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("c").setDescription("Option C").setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("d").setDescription("Option D").setRequired(true)
        )
    ),
  run: async (Becca, interaction, t, config) => {
    try {
      await interaction.deferReply();
      const subcommand = interaction.options.getSubcommand();
      const handler = handlers[subcommand] || handleInvalidSubcommand;
      await handler(Becca, interaction, t, config);
      Becca.pm2.metrics.commands.mark();
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "community group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "community group", errorId, t)],
      });
    }
  },
};
