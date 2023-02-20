/* eslint-disable jsdoc/require-param */
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Generates an embed containing information on how to interact with Becca,
 * links to the support server, docs, and code.
 */
export const handleHelp: CommandHandler = async (Becca, interaction, t) => {
  try {
    const helpEmbed = new EmbedBuilder();
    helpEmbed.setTitle(t<string, string>("commands:becca.help.title"));
    helpEmbed.setDescription(
      t<string, string>("commands:becca.help.description")
    );
    helpEmbed.addFields([
      {
        name: t<string, string>("commands:becca.help.support.title"),
        value: t<string, string>("commands:becca.help.support.description"),
      },
      {
        name: t<string, string>("commands:becca.help.docs.title"),
        value: t<string, string>("commands:becca.help.docs.description"),
      },
      {
        name: t<string, string>("commands:becca.help.source.title"),
        value: t<string, string>("commands:becca.help.source.description"),
      },
      {
        name: t<string, string>("commands:becca.help.bug.title"),
        value: t<string, string>("commands:becca.help.bug.description"),
      },
      {
        name: t<string, string>("commands:becca.help.privacy.title"),
        value: t<string, string>("commands:becca.help.privacy.description"),
      },
    ]);
    helpEmbed.setFooter({
      text: t<string, string>("defaults.footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    const supportServerButton = new ButtonBuilder()
      .setLabel(t<string, string>("commands:becca.help.buttons.support"))
      .setEmoji("<:BeccaHuh:877278300739887134>")
      .setStyle(ButtonStyle.Link)
      .setURL("https://chat.nhcarrigan.com");
    const inviteButton = new ButtonBuilder()
      .setLabel(t<string, string>("commands:becca.help.buttons.invite"))
      .setEmoji("<:BeccaHello:867102882791424073>")
      .setStyle(ButtonStyle.Link)
      .setURL("https://invite.beccalyria.com");
    const codeButton = new ButtonBuilder()
      .setLabel(t<string, string>("commands:becca.help.buttons.source"))
      .setEmoji("<:BeccaNotes:883854700762505287>")
      .setStyle(ButtonStyle.Link)
      .setURL("https://github.com/beccalyria/discord-bot");
    const docsButton = new ButtonBuilder()
      .setLabel(t<string, string>("commands:becca.help.buttons.docs"))
      .setEmoji("<:BeccaSalute:872577687590420501>")
      .setStyle(ButtonStyle.Link)
      .setURL(
        "https://docs.beccalyria.com?utm_source=discord&utm_medium=help-command"
      );
    const reportButton = new ButtonBuilder()
      .setLabel(t<string, string>("commands:becca.help.buttons.issue"))
      .setEmoji("<:BeccaBan:897545793886634085>")
      .setStyle(ButtonStyle.Link)
      .setURL("https://github.com/beccalyria/discord-bot/issues/new/choose");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
      supportServerButton,
      inviteButton,
      codeButton,
      docsButton,
      reportButton,
    ]);

    await interaction.editReply({ embeds: [helpEmbed], components: [row] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "help command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "help", errorId, t)],
    });
  }
};
