/* eslint-disable jsdoc/require-jsdoc */
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";

import { CommandInt } from "../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { handleReset } from "../modules/commands/subcommands/config/handleReset";
import { handleSet } from "../modules/commands/subcommands/config/handleSet";
import { handleView } from "../modules/commands/subcommands/config/handleView";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const config: CommandInt = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Modify your server settings.")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("set")
        .setDescription("Update a server setting.")
        .addStringOption((option) =>
          option
            .setName("setting")
            .setDescription("The setting to update")
            .setRequired(true)
            .addChoices([
              ["Thanks System", "thanks"],
              ["Level System", "levels"],
              ["Join/Leave Channel", "welcome_channel"],
              ["Moderation Log Channel", "log_channel"],
              ["Level Log Channel", "level_channel"],
              ["Suggestion Channel", "suggestion_channel"],
              ["Muted Role", "muted_role"],
              ["Custom Welcome Message", "custom_welcome"],
              ["Heart Users", "hearts"],
              ["Blocked Users", "blocked"],
              ["Self-assignable Roles", "self_roles"],
              ["Anti-link Channels", "anti_links"],
              ["Allowed Link Channels", "permit_links"],
              ["Allowed Link Roles", "link_roles"],
              ["Allowed Link Regex", "allowed_links"],
              ["Link Delete Message", "link_message"],
              ["Level-assigned Roles", "level_roles"],
              ["Role on Join", "join_role"],
              ["Custom Leave Message", "leave_message"],
              ["Report Channel", "report_channel"],
              ["No Levelling Channels", "level_ignore"],
              ["Sass Mode", "sass_mode"],
            ])
        )
        .addStringOption((option) =>
          option
            .setName("value")
            .setDescription("The value to set.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("reset")
        .setDescription("Reset a setting to default.")
        .addStringOption((option) =>
          option
            .setName("setting")
            .setDescription("The setting to reset")
            .setRequired(true)
            .addChoices([
              ["Thanks System", "thanks"],
              ["Level System", "levels"],
              ["Join/Leave Channel", "welcome_channel"],
              ["Moderation Log Channel", "log_channel"],
              ["Level Log Channel", "level_channel"],
              ["Suggestion Channel", "suggestion_channel"],
              ["Muted Role", "muted_role"],
              ["Custom Welcome Message", "custom_welcome"],
              ["Heart Users", "hearts"],
              ["Blocked Users", "blocked"],
              ["Self-assignable Roles", "self_roles"],
              ["Anti-link Channels", "anti_links"],
              ["Allowed Link Channels", "permit_links"],
              ["Allowed Link Roles", "link_roles"],
              ["Allowed Link Regex", "allowed_links"],
              ["Link Delete Message", "link_message"],
              ["Level-assigned Roles", "level_roles"],
              ["Role on Join", "join_role"],
              ["Custom Leave Message", "leave_message"],
              ["Report Channel", "report_channel"],
              ["No Levelling Channels", "level_ignore"],
              ["Sass Mode", "sass_mode"],
            ])
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("view")
        .setDescription("View your settings.")
        .addStringOption((option) =>
          option
            .setName("setting")
            .setDescription("The setting list to view.")
            .setRequired(true)
            .addChoices([
              ["Heart Users", "hearts"],
              ["Self-Assignable Roles", "self_roles"],
              ["Blocked Users", "blocked"],
              ["Anti-link Channels", "anti_links"],
              ["Allowed Link Channels", "permit_links"],
              ["Allowed Link Roles", "link_roles"],
              ["Allowed Link Regex", "allowed_links"],
              ["Level-assigned Roles", "level_roles"],
              ["No Levelling Channels", "level_ignore"],
              ["Global Settings", "global"],
            ])
        )
    ),
  run: async (Becca, interaction, config) => {
    try {
      await interaction.deferReply();
      const { guild, member } = interaction;

      if (!guild || !member) {
        await interaction.editReply({
          content: Becca.responses.missingGuild,
        });
        return;
      }

      if (
        (typeof member.permissions === "string" ||
          !member.permissions.has("MANAGE_GUILD")) &&
        member.user.id !== Becca.configs.ownerId
      ) {
        await interaction.editReply({
          content: Becca.responses.noPermission,
        });
        return;
      }

      const action = interaction.options.getSubcommand();
      switch (action) {
        case "set":
          await handleSet(Becca, interaction, config);
          break;
        case "reset":
          await handleReset(Becca, interaction, config);
          break;
        case "view":
          await handleView(Becca, interaction, config);
          break;
        default:
          await interaction.editReply({
            content: Becca.responses.invalidCommand,
          });
          break;
      }
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "config group command",
        err,
        interaction.guild?.name
      );
      await interaction
        .reply({
          embeds: [errorEmbedGenerator(Becca, "config group", errorId)],
          ephemeral: true,
        })
        .catch(
          async () =>
            await interaction.editReply({
              embeds: [errorEmbedGenerator(Becca, "config group", errorId)],
            })
        );
    }
  },
};
