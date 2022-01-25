import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";

import { Command } from "../interfaces/commands/Command";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { handleCreate } from "../modules/commands/subcommands/reactionrole/handleCreate";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { getRandomValue } from "../utils/getRandomValue";

export const reactionRole: Command = {
  data: new SlashCommandBuilder()
    .setName("reactionrole")
    .setDescription("Commands for managing reaction roles.")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("create")
        .setDescription("Create a new post with role buttons")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel to create the post in.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("header")
            .setDescription("Text to include at the top of the post.")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role1")
            .setDescription("Role to create a button for.")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option.setName("role2").setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option.setName("role3").setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option.setName("role4").setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option.setName("role5").setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option.setName("role6").setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option.setName("role7").setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option.setName("role8").setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option.setName("role9").setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option
            .setName("role10")
            .setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option
            .setName("role11")
            .setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option
            .setName("role12")
            .setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option
            .setName("role13")
            .setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option
            .setName("role14")
            .setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option
            .setName("role15")
            .setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option
            .setName("role16")
            .setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option
            .setName("role17")
            .setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option
            .setName("role18")
            .setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option
            .setName("role19")
            .setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option
            .setName("role20")
            .setDescription("Role to create a button for.")
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
        case "create":
          await handleCreate(Becca, interaction, t, config);
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
        embeds: [errorEmbedGenerator(Becca, "reaction role group", errorId, t)],
      });
    }
  },
};
