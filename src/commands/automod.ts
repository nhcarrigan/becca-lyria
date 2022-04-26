/* eslint-disable jsdoc/require-jsdoc */
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";

import {
  automodAntiphishChoices,
  automodChoices,
  automodToggleChoices,
  automodViewChoices,
} from "../config/commands/settingsChoices";
import { Command } from "../interfaces/commands/Command";
import { CommandHandler } from "../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
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

export const automod: Command = {
  data: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("Manages the automod config")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("set")
        .setDescription("Set a specific automod setting.")
        .addStringOption((option) =>
          option
            .setName("setting")
            .setDescription("The setting to edit.")
            .addChoices(...automodChoices)
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("value")
            .setDescription("The value to set the setting to.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("reset")
        .setDescription("Clear the value of a specific setting.")
        .addStringOption((option) =>
          option
            .setName("setting")
            .setDescription("The setting to clear the value of.")
            .addChoices(...automodChoices)
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("view")
        .setDescription("View your logging settings.")
        .addStringOption((option) =>
          option
            .setName("setting")
            .setDescription("The setting to view.")
            .setRequired(true)
            .addChoices(...automodViewChoices)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("toggle")
        .setDescription("Toggle an automod feature on or off.")
        .addStringOption((option) =>
          option
            .setName("setting")
            .setDescription("The setting to toggle.")
            .setRequired(true)
            .addChoices(...automodToggleChoices)
        )
        .addStringOption((option) =>
          option
            .setName("value")
            .setDescription("Enable/Disable the setting.")
            .setRequired(true)
            .addChoices(
              { name: "Enabled", value: "on" },
              { name: "Disabled", value: "off" }
            )
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("antiphish")
        .setDescription(
          "Set the action to take when a fishing link is detected."
        )
        .addStringOption((option) =>
          option
            .setName("action")
            .setDescription("The action to take.")
            .setRequired(true)
            .addChoices(...automodAntiphishChoices)
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
          !member.permissions.has("MANAGE_GUILD")) &&
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
