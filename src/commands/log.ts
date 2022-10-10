/* eslint-disable jsdoc/require-jsdoc */
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "@discordjs/builders";
import { PermissionFlagsBits } from "discord.js";

import { Command } from "../interfaces/commands/Command";
import { CommandHandler } from "../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { attachSubcommandsToGroup } from "../utils/attachSubcommands";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { getRandomValue } from "../utils/getRandomValue";

import { handleInvalidSubcommand } from "./subcommands/handleInvalidSubcommand";
import { handleLogReset } from "./subcommands/log/handleLogReset";
import { handleLogSet } from "./subcommands/log/handleLogSet";
import { handleLogView } from "./subcommands/log/handleLogView";

const handlers: { [key: string]: CommandHandler } = {
  set: handleLogSet,
  reset: handleLogReset,
  view: handleLogView,
};

const subcommands = [
  new SlashCommandSubcommandBuilder()
    .setName("message-events")
    .setDescription("Set where message edits/deletes should be logged.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to log.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("voice-events")
    .setDescription("Set where voice chat leaves/joins/mutes should be logged.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to log.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("thread-events")
    .setDescription("Set where thread create/deletes should be logged.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to log.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("member-events")
    .setDescription("Set where member updates should be logged.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to log.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("moderation-log")
    .setDescription("Set where moderation actions should be logged.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to log.")
        .setRequired(true)
    ),
];

export const log: Command = {
  data: new SlashCommandBuilder()
    .setName("log")
    .setDescription("Manages the logging config.")
    .setDMPermission(false)
    .addSubcommandGroup(
      attachSubcommandsToGroup(
        new SlashCommandSubcommandGroupBuilder()
          .setName("set")
          .setDescription("Set a specific log setting."),
        subcommands
      )
    )
    .addSubcommandGroup(
      attachSubcommandsToGroup(
        new SlashCommandSubcommandGroupBuilder()
          .setName("reset")
          .setDescription("Clear the value of a specific setting."),
        subcommands,
        true
      )
    )
    .addSubcommandGroup(
      attachSubcommandsToGroup(
        new SlashCommandSubcommandGroupBuilder()
          .setName("view")
          .setDescription("View your logging settings."),
        subcommands,
        true
      )
    ),
  run: async (Becca, interaction, t, config) => {
    try {
      await interaction.deferReply();
      const { guild, member } = interaction;

      if (!guild || !member) {
        await interaction.editReply({
          content: getRandomValue(t("responses:missingGuild")),
        });
        return;
      }

      if (
        (typeof member.permissions === "string" ||
          !member.permissions.has(PermissionFlagsBits.ManageGuild)) &&
        member.user.id !== Becca.configs.ownerId
      ) {
        await interaction.editReply({
          content: getRandomValue(t("responses:noPermission")),
        });
        return;
      }

      const action = interaction.options.getSubcommand();
      const handler = handlers[action] || handleInvalidSubcommand;
      await handler(Becca, interaction, t, config);
      Becca.pm2.metrics.commands.mark();
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "log group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "log group", errorId, t)],
      });
    }
  },
};
