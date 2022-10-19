/* eslint-disable jsdoc/require-jsdoc */
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "@discordjs/builders";
import { PermissionFlagsBits } from "discord.js";

import { Command } from "../interfaces/commands/Command";
import { Settings } from "../interfaces/settings/Settings";
import { SettingsHandler } from "../interfaces/settings/SettingsHandler";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { attachSubcommandsToGroup } from "../utils/attachSubcommands";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { getRandomValue } from "../utils/getRandomValue";

import { handleReset } from "./subcommands/config/handleReset";
import { handleSet } from "./subcommands/config/handleSet";
import { handleView } from "./subcommands/config/handleView";
import { handleInvalidSubcommand } from "./subcommands/handleInvalidSubcommand";

const handlers: { [key: string]: SettingsHandler } = {
  set: handleSet,
  reset: handleReset,
  view: handleView,
};

const subcommands = [
  new SlashCommandSubcommandBuilder()
    .setName("suggestion_channel")
    .setDescription("Set where suggestions should be posted.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to put suggestions in.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("hearts")
    .setDescription("Add/remove a user from the list of heart reactions.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to toggle.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("blocked")
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
    .setName("appeal_link")
    .setDescription("Set a link for your server's ban appeal form.")
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("The link to include in ban messages.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("sass_mode")
    .setDescription("Toggle Becca's sass mode.")
    .addStringOption((option) =>
      option
        .setName("toggle")
        .setDescription("Turn sass on or off.")
        .addChoices({ name: "on", value: "on" }, { name: "off", value: "off" })
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("emote_channels")
    .setDescription("Add/remove a channel on the list of emote-only channels.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to toggle emote-only mode in.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("report_channel")
    .setDescription("Set where message reports should be posted.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to put reports in.")
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

      const action = interaction.options.getSubcommandGroup(true);
      const setting = interaction.options.getSubcommand(true) as Settings;
      const subcommandData = subcommands.find((el) => el.name === setting);
      if (!subcommandData) {
        await handleInvalidSubcommand(Becca, interaction, t, serverConfig);
        return;
      }
      const value = `${
        interaction.options.get(subcommandData.options[0].name, true).value
      }`;
      const handler = handlers[action];
      await handler(Becca, interaction, t, serverConfig, setting, value);
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
