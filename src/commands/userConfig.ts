import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";

import UserConfigModel from "../database/models/UserConfigModel";
import { Command } from "../interfaces/commands/Command";
import { UserConfigCommandHandler } from "../interfaces/commands/UserConfigCommandHandler";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { getRandomValue } from "../utils/getRandomValue";

import { handleInvalidSubcommand } from "./subcommands/handleInvalidSubcommand";
import { handleLevelCard } from "./subcommands/userconfig/handleLevelCard";
import { handleUserConfigView } from "./subcommands/userconfig/handleUserConfigView";

const handlers: { [key: string]: UserConfigCommandHandler } = {
  view: handleUserConfigView,
  levelcard: handleLevelCard,
};

export const userConfig: Command = {
  data: new SlashCommandBuilder()
    .setName("userconfig")
    .setDescription("Manage your personal bot settings.")
    .setDMPermission(false)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("view")
        .setDescription("View your personal bot settings.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("levelcard")
        .setDescription("Customise your level card")
        .addStringOption((option) =>
          option
            .setName("background")
            .setDescription("The background colour for your card.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("foreground")
            .setDescription("The foreground colour for your card.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("progress")
            .setDescription("The colour of your progress bar.")
            .setRequired(true)
        )
    ),
  run: async (Becca, interaction, t) => {
    try {
      await interaction.deferReply();
      const { guild, user } = interaction;
      const subcommand = interaction.options.getSubcommand();

      if (!guild || !user) {
        await interaction.editReply({
          content: getRandomValue(t("responses:missingGuild")),
        });
        return;
      }

      const userConfig =
        (await UserConfigModel.findOne({ userId: user.id })) ||
        (await UserConfigModel.create({
          userId: user.id,
          levelcard: {
            background: "",
            foreground: "",
            progress: "",
          },
        }));

      const handler = handlers[subcommand] || handleInvalidSubcommand;
      await handler(Becca, interaction, t, userConfig);
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "userconfig command group",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "userconfig group", errorId, t)],
      });
    }
  },
};
