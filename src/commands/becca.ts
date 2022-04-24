/* eslint-disable jsdoc/require-jsdoc */
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";

import { Command } from "../interfaces/commands/Command";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { getRandomValue } from "../utils/getRandomValue";

import { handleAbout } from "./subcommands/becca/handleAbout";
import { handleAdventure } from "./subcommands/becca/handleAdventure";
import { handleArt } from "./subcommands/becca/handleArt";
import { handleContact } from "./subcommands/becca/handleContact";
import { handleDonate } from "./subcommands/becca/handleDonate";
import { handleEmote } from "./subcommands/becca/handleEmote";
import { handleHelp } from "./subcommands/becca/handleHelp";
import { handleInvite } from "./subcommands/becca/handleInvite";
import { handlePing } from "./subcommands/becca/handlePing";
import { handlePrivacy } from "./subcommands/becca/handlePrivacy";
import { handleProfile } from "./subcommands/becca/handleProfile";
import { handleStats } from "./subcommands/becca/handleStats";
import { handleTranslators } from "./subcommands/becca/handleTranslators";
import { handleUpdates } from "./subcommands/becca/handleUpdates";
import { handleUptime } from "./subcommands/becca/handleUptime";

export const becca: Command = {
  data: new SlashCommandBuilder()
    .setName("becca")
    .setDescription("Returns the uptime of the bot.")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("ping")
        .setDescription("Returns the ping of the bot")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("help")
        .setDescription("Shows information on how to use the bot.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("about")
        .setDescription("Shows information about Becca.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("invite")
        .setDescription("Provides a link to invite Becca to your server.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("art")
        .setDescription("Returns an art of Becca!")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("donate")
        .setDescription(
          "Gives instructions on how to support Becca's development financially."
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("uptime")
        .setDescription("Shows how long Becca has been online.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("profile")
        .setDescription("Tells the story of Becca's character.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("updates")
        .setDescription(
          "Shows the latest updates to Becca, the next scheduled update, and additional details."
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("stats")
        .setDescription("Shows bot statistics")
        .addStringOption((option) =>
          option
            .setName("view")
            .setDescription("Which stat do you want to view?")
            .addChoices([
              ["Bot Votes", "bvotes"],
              ["Command Leaderboard", "commands"],
              ["Server Votes", "svotes"],
            ])
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("emote")
        .setDescription("Returns a Becca Emote!")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("adventure")
        .setDescription("Returns an image from one of Becca's adventures!")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("privacy")
        .setDescription("Returns a link to Becca's privacy policy.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("contact")
        .setDescription("Offers links to contact the development team.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("translators")
        .setDescription(
          "Lists the wonderful people who have helped translate Becca."
        )
    ),
  run: async (Becca, interaction, t, config) => {
    try {
      await interaction.deferReply();

      const subCommand = interaction.options.getSubcommand();
      switch (subCommand) {
        case "ping":
          await handlePing(Becca, interaction, t, config);
          break;
        case "help":
          await handleHelp(Becca, interaction, t, config);
          break;
        case "about":
          await handleAbout(Becca, interaction, t, config);
          break;
        case "invite":
          await handleInvite(Becca, interaction, t, config);
          break;
        case "art":
          await handleArt(Becca, interaction, t, config);
          break;
        case "donate":
          await handleDonate(Becca, interaction, t, config);
          break;
        case "uptime":
          await handleUptime(Becca, interaction, t, config);
          break;
        case "profile":
          await handleProfile(Becca, interaction, t, config);
          break;
        case "updates":
          await handleUpdates(Becca, interaction, t, config);
          break;
        case "stats":
          await handleStats(Becca, interaction, t, config);
          break;
        case "emote":
          await handleEmote(Becca, interaction, t, config);
          break;
        case "adventure":
          await handleAdventure(Becca, interaction, t, config);
          break;
        case "privacy":
          await handlePrivacy(Becca, interaction, t, config);
          break;
        case "contact":
          await handleContact(Becca, interaction, t, config);
          break;
        case "translators":
          await handleTranslators(Becca, interaction, t, config);
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
        "becca group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "becca group", errorId, t)],
      });
    }
  },
};
