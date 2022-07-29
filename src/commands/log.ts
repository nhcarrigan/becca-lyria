/* eslint-disable jsdoc/require-jsdoc */
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { PermissionFlagsBits } from "discord.js";

import { logChoices } from "../config/commands/settingsChoices";
import { Command } from "../interfaces/commands/Command";
import { CommandHandler } from "../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
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

export const log: Command = {
  data: new SlashCommandBuilder()
    .setName("log")
    .setDescription("Manages the logging config.")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("set")
        .setDescription("Set a channel for a specific logging type")
        .addStringOption((option) =>
          option
            .setName("event")
            .setDescription("The type of events to log")
            .addChoices(...logChoices)
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to log the events in.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("reset")
        .setDescription("Clear the logging option for a specific event.")
        .addStringOption((option) =>
          option
            .setName("event")
            .setDescription("The type of events to log")
            .addChoices(...logChoices)
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("view")
        .setDescription("View your logging settings.")
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
