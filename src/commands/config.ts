/* eslint-disable jsdoc/require-jsdoc */
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "@discordjs/builders";
import { PermissionFlagsBits } from "discord.js";

import {
  configChoices,
  configViewChoices,
} from "../config/commands/settingsChoices";
import { Command } from "../interfaces/commands/Command";
import { CommandHandler } from "../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { attachSubcommandsToGroup } from "../utils/attachSubcommands";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { getRandomValue } from "../utils/getRandomValue";

import { handleReset } from "./subcommands/config/handleReset";
import { handleSet } from "./subcommands/config/handleSet";
import { handleView } from "./subcommands/config/handleView";
import { handleInvalidSubcommand } from "./subcommands/handleInvalidSubcommand";

const handlers: { [key: string]: CommandHandler } = {
  set: handleSet,
  reset: handleReset,
  view: handleView,
};

const subcommands = [
  new SlashCommandSubcommandBuilder()
    .setName("suggestion-channel")
    .setDescription("Set where suggestions should be posted.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to put suggestions in.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("heart-reacts")
    .setDescription("Add/remove a user from the list of heart reactions.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to toggle.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("block-user")
    .setDescription(
      "Add/remove a user from the list of users who cannot interact with Becca"
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to toggle.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("ban-appeal")
    .setDescription("Set a link for your server's ban appeal form.")
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("The link to include in ban messages.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("sass-mode")
    .setDescription("Toggle Becca's sass mode.")
    .addStringOption((option) =>
      option
        .setName("toggle")
        .setDescription("Turn sass on or off.")
        .addChoices({ name: "on", value: "on" }, { name: "off", value: "off" })
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("emote-channel")
    .setDescription("Add/remove a channel on the list of emote-only channels.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to toggle emote-only mode in.")
        .setRequired(true)
    ),
];

export const config: Command = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Modify your server settings.")
    .setDMPermission(false)
    .addSubcommandGroup(
      attachSubcommandsToGroup(
        new SlashCommandSubcommandGroupBuilder()
          .setName("set")
          .setDescription("Set a specific setting."),
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
          .setDescription("View your config settings."),
        subcommands,
        true
      )
    ),
  run: async (Becca, interaction, t, serverConfig) => {
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
      await handler(Becca, interaction, t, serverConfig);
      Becca.pm2.metrics.commands.mark();
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "config group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "config group", errorId, t)],
      });
    }
  },
};
