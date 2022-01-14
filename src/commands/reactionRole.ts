import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";

import { Command } from "../interfaces/commands/Command";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { handleReactionAdd } from "../modules/commands/subcommands/reactionrole/handleReactionAdd";
import { handleReactionList } from "../modules/commands/subcommands/reactionrole/handleReactionList";
import { handleReactionRemove } from "../modules/commands/subcommands/reactionrole/handleReactionRemove";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { getRandomValue } from "../utils/getRandomValue";

export const reactionRole: Command = {
  data: new SlashCommandBuilder()
    .setName("reactionrole")
    .setDescription("Commands for managing reaction roles.")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("add")
        .setDescription(
          "(⚠️ CURRENTLY IN BETA - SUBJECT TO CHANGE) Add a reaction role to a message."
        )
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("The message LINK to add the reaction role to.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("emoji")
            .setDescription("The emoji to react with.")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to add or remove.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("remove")
        .setDescription(
          "(⚠️ CURRENTLY IN BETA - SUBJECT TO CHANGE) Remove a reaction role from a message."
        )
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription(
              "The message LINK to remove the reaction role from."
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("emoji")
            .setDescription("The emoji to react with.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("list")
        .setDescription(
          "(⚠️ CURRENTLY IN BETA - SUBJECT TO CHANGE) List all reaction roles on a message."
        )
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("The message LINK to list the reaction roles on.")
            .setRequired(true)
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
      switch (action) {
        case "add":
          await handleReactionAdd(Becca, interaction, t, config);
          break;
        case "remove":
          await handleReactionRemove(Becca, interaction, t, config);
          break;
        case "list":
          await handleReactionList(Becca, interaction, t, config);
          break;
        default:
          await interaction.editReply({
            content: getRandomValue(t("responses:invalidCommand")),
          });
          break;
      }
      Becca.pm2.metrics.commands.mark();
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "reaction role command group",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "reaction role group", errorId)],
      });
    }
  },
};
