import {
  ChannelType,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

import { CommandName } from "../../interfaces/commands/CommandName";
import { attachSubcommandsToGroup } from "../../utils/attachSubcommands";

import { automodSubcommands } from "./_subcommands";

export const Commands: {
  [key in CommandName]:
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    | SlashCommandSubcommandsOnlyBuilder;
} = {
  automod: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("Manages the automod config")
    .setDMPermission(false)
    .addSubcommandGroup(
      attachSubcommandsToGroup(
        new SlashCommandSubcommandGroupBuilder()
          .setName("set")
          .setDescription("Set a specific automod setting."),
        automodSubcommands
      )
    )
    .addSubcommandGroup(
      attachSubcommandsToGroup(
        new SlashCommandSubcommandGroupBuilder()
          .setName("reset")
          .setDescription("Clear the value of a specific setting."),
        automodSubcommands,
        true
      )
    )
    .addSubcommandGroup(
      attachSubcommandsToGroup(
        new SlashCommandSubcommandGroupBuilder()
          .setName("view")
          .setDescription("View your automod settings."),
        automodSubcommands,
        true
      )
    ),
  becca: new SlashCommandBuilder()
    .setName("becca")
    .setDescription("Returns the uptime of the bot.")
    .setDMPermission(false)
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
            .addChoices(
              { name: "Bot Votes", value: "bvotes" },
              { name: "Command Leaderboard", value: "commands" },
              { name: "Server Votes", value: "svotes" }
            )
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
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("feedback")
        .setDescription(
          "Provide feedback on Becca - request features, report bugs, or share your thoughts!"
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("announcements")
        .setDescription(
          "Subscribe to Becca's announcements directly in your server."
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel you want announcements posted in.")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    ),
};
