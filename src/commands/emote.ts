/* eslint-disable jsdoc/require-jsdoc */
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";

import { emoteChoices } from "../config/commands/emoteData";
import { EmoteOptOut } from "../config/optout/EmoteOptOut";
import { Command } from "../interfaces/commands/Command";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { handleEmoteUse } from "../modules/commands/subcommands/emote/handleEmoteUse";
import { handleEmoteView } from "../modules/commands/subcommands/emote/handleEmoteView";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { getRandomValue } from "../utils/getRandomValue";

export const emote: Command = {
  data: new SlashCommandBuilder()
    .setName("emote")
    .setDescription("Emote commands!")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("use")
        .setDescription("Use an emote on someone!")
        .addStringOption((option) =>
          option
            .setName("emote")
            .setRequired(true)
            .setDescription("The emote to use.")
            .addChoices(emoteChoices)
        )
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to target with your emote.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("view")
        .setDescription(
          "View the number of times you have been the target of an emote."
        )
    ),
  run: async (Becca, interaction, t, config) => {
    try {
      await interaction.deferReply();

      if (EmoteOptOut.includes(interaction.user.id)) {
        await interaction.editReply(
          "You have opted out of the emote system and cannot use these commands."
        );
        return;
      }

      const subcommand = interaction.options.getSubcommand();

      switch (subcommand) {
        case "use":
          await handleEmoteUse(Becca, interaction, t, config);
          break;
        case "view":
          await handleEmoteView(Becca, interaction, t, config);
          break;
        default:
          await interaction.reply({
            content: getRandomValue(t("responses:invalidCommand")),
          });
      }
      Becca.pm2.metrics.commands.mark();
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "emote group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "emote group", errorId, t)],
      });
    }
  },
};
