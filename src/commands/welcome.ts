import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";

import { Command } from "../interfaces/commands/Command";
import { CommandHandler } from "../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { attachSubcommandsToGroup } from "../utils/attachSubcommands";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { getRandomValue } from "../utils/getRandomValue";

import { handleInvalidSubcommand } from "./subcommands/handleInvalidSubcommand";

const handlers: { [key: string]: CommandHandler } = {};

const subcommands = [
  new SlashCommandSubcommandBuilder()
    .setName("welcome-channel")
    .setDescription("Set the channel where welcome messages are sent.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to use.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("goodbye-channel")
    .setDescription("Set the channel where goodbye messages are sent.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to use.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("welcome-message")
    .setDescription(
      "Set a custom message to be sent when someone joins the server."
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("goodbye-message")
    .setDescription(
      "Set a custom message to be sent when someone leaves the server."
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("join-role")
    .setDescription("Set a role to be assigned when someone joins.")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to assign.")
        .setRequired(true)
    ),
];

export const welcome: Command = {
  data: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Manages the welcome system for the server.")
    .setDMPermission(false)
    .addSubcommandGroup(
      attachSubcommandsToGroup(
        new SlashCommandSubcommandGroupBuilder()
          .setName("set")
          .setDescription("Set a specific automod setting."),
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
          .setDescription("View your automod settings."),
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
        "welcome group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "automod group", errorId, t)],
      });
    }
  },
};
