/* eslint-disable jsdoc/require-jsdoc */
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { GuildMember, PermissionFlagsBits } from "discord.js";

import { Command } from "../interfaces/commands/Command";
import { CommandHandler } from "../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { getRandomValue } from "../utils/getRandomValue";

import { handleInvalidSubcommand } from "./subcommands/handleInvalidSubcommand";
import { handleTriggerAdd } from "./subcommands/triggers/handleTriggerAdd";
import { handleTriggerRemove } from "./subcommands/triggers/handleTriggerRemove";
import { handleTriggerView } from "./subcommands/triggers/handleTriggerView";

const handlers: { [key: string]: CommandHandler } = {
  add: handleTriggerAdd,
  remove: handleTriggerRemove,
  view: handleTriggerView,
};

export const triggers: Command = {
  data: new SlashCommandBuilder()
    .setName("triggers")
    .setDescription("Manage triggers for your server.")
    .setDMPermission(false)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("add")
        .setDescription("Add a new trigger.")
        .addStringOption((option) =>
          option
            .setName("trigger")
            .setDescription("The text to look for.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("response")
            .setDescription("The response to send when the trigger is seen.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("remove")
        .setDescription("Remove a trigger.")
        .addStringOption((option) =>
          option
            .setName("trigger")
            .setDescription("The trigger to remove.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("view")
        .setDescription("View a list of triggers in the server.")
    ),
  run: async (Becca, interaction, t, config) => {
    try {
      await interaction.deferReply();

      const subcommand = interaction.options.getSubcommand();

      if (
        !(interaction.member as GuildMember).permissions.has(
          PermissionFlagsBits.ManageGuild
        )
      ) {
        await interaction.editReply({
          content: getRandomValue(
            t<string, string[]>("responses:noPermission")
          ),
        });
        return;
      }
      const handler = handlers[subcommand] || handleInvalidSubcommand;
      await handler(Becca, interaction, t, config);
      Becca.pm2.metrics.commands.mark();
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "triggers group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "triggers group", errorId, t)],
      });
    }
  },
};
