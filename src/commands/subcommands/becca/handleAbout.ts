/* eslint-disable jsdoc/require-param */
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { getCounts } from "../../../modules/becca/getCounts";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Generates an embed containing information about Becca.
 */
export const handleAbout: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { guilds, members, commands } = getCounts(Becca);
    const aboutEmbed = new EmbedBuilder();
    aboutEmbed.setColor(Becca.colours.default);
    aboutEmbed.setTitle(t<string, string>("commands:becca.about.title"));
    aboutEmbed.setDescription(
      t<string, string>("commands:becca.about.description")
    );
    aboutEmbed.addFields([
      {
        name: t<string, string>("commands:becca.about.version"),
        value: process.env.npm_package_version || "unknown version",
        inline: true,
      },
      {
        name: t<string, string>("commands:becca.about.creation"),
        value: "Sunday, 31 May 2020",
        inline: true,
      },
      {
        name: t<string, string>("commands:becca.about.guilds"),
        value: guilds.toString(),
        inline: true,
      },
      {
        name: t<string, string>("commands:becca.about.members"),
        value: members.toString(),
        inline: true,
      },
      {
        name: t<string, string>("commands:becca.about.commands"),
        value: commands.toString(),
        inline: true,
      },
      {
        name: t<string, string>("commands:becca.about.colour"),
        value: t<string, string>("commands:becca.about.purple"),
        inline: true,
      },
    ]);
    aboutEmbed.setFooter({
      text: t<string, string>("defaults.footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    const supportServerButton = new ButtonBuilder()
      .setLabel(t<string, string>("commands:becca.about.buttons.join"))
      .setEmoji("<:BeccaHuh:877278300739887134>")
      .setStyle(ButtonStyle.Link)
      .setURL("https://chat.nhcarrigan.com");
    const inviteButton = new ButtonBuilder()
      .setLabel(t<string, string>("commands:becca.about.buttons.invite"))
      .setEmoji("<:BeccaHello:867102882791424073>")
      .setStyle(ButtonStyle.Link)
      .setURL("https://invite.beccalyria.com");
    const codeButton = new ButtonBuilder()
      .setLabel(t<string, string>("commands:becca.about.buttons.code"))
      .setEmoji("<:BeccaNotes:883854700762505287>")
      .setStyle(ButtonStyle.Link)
      .setURL("https://github.com/beccalyria/discord-bot");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
      supportServerButton,
      inviteButton,
      codeButton,
    ]);

    await interaction.editReply({ embeds: [aboutEmbed], components: [row] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "about command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "about", errorId, t)],
    });
  }
};
