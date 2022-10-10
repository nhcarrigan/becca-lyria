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

import { handleAutomodAntiphish } from "./subcommands/automod/handleAutomodAntiphish";
import { handleAutomodReset } from "./subcommands/automod/handleAutomodReset";
import { handleAutomodSet } from "./subcommands/automod/handleAutomodSet";
import { handleAutomodView } from "./subcommands/automod/handleAutomodView";
import { handleInvalidSubcommand } from "./subcommands/handleInvalidSubcommand";

const handlers: { [key: string]: CommandHandler } = {
  set: handleAutomodSet,
  toggle: handleAutomodSet,
  reset: handleAutomodReset,
  view: handleAutomodView,
  antiphish: handleAutomodAntiphish,
};

const subcommands = [
  new SlashCommandSubcommandBuilder()
    .setName("channels")
    .setDescription("Add or remove a channel from automod.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to edit.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("ignored-channels")
    .setDescription("Add or remove a channel from automod's ignore list.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to edit.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("exempt")
    .setDescription("Add or remove a role from the automod exemption list.")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to edit.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("allowed-links")
    .setDescription("Add or remove a regex to test for allowed links.")
    .addStringOption((option) =>
      option
        .setName("regex")
        .setDescription("The regex to match against links")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("link-delete")
    .setDescription("Set a custom message to be sent when a link is deleted.")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("profanity-delete")
    .setDescription(
      "Set a custom message to be sent when profanity is deleted."
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("antifish")
    .setDescription("Set the action to take when a phishing link is detected.")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send.")
        .setRequired(true)
        .addChoices(
          { name: "Do nothing when a scam link is detected.", value: "none" },
          { name: "Mute the user for 24 hours.", value: "mute" },
          { name: "Kick the user.", value: "kick" },
          { name: "Ban the user.", value: "ban" }
        )
    ),
];

export const automod: Command = {
  data: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("Manages the automod config")
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
        "automod group command",
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
