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
    .setName("toggle")
    .setDescription("Turn the level system on or off.")
    .addStringOption((option) =>
      option
        .setName("toggle")
        .setDescription("Turn levels on or off.")
        .addChoices({ name: "on", value: "on" }, { name: "off", value: "off" })
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("logs")
    .setDescription("Set where level + role messages should be logged.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to log.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("roles")
    .setDescription("Add or remove a level-based role.")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to edit.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("level")
        .setDescription("The level to assign the role.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("style")
    .setDescription("Set the style of level/role messages.")
    .addStringOption((option) =>
      option
        .setName("toggle")
        .setDescription("The style to use.")
        .addChoices(
          { name: "text", value: "text" },
          { name: "embed", value: "embed" }
        )
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("level-message")
    .setDescription("Set a custom message to be sent when someone levels up.")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("role-message")
    .setDescription(
      "Set a custom message to be sent when someone earns a level role."
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("starting-xp")
    .setDescription("Set a value for how much XP a user starts with.")
    .addIntegerOption((option) =>
      option
        .setName("points")
        .setDescription("The XP to award when someone joins.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("ignored-channels")
    .setDescription("Add or remove a channel from the levels ignore list.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to edit.")
        .setRequired(true)
    ),
];

export const levels: Command = {
  data: new SlashCommandBuilder()
    .setName("levels")
    .setDescription("Manages the level system for the server.")
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
