/* eslint-disable jsdoc/require-param */
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Generates an embed containing information on how to interact with Becca,
 * links to the support server, docs, and code.
 */
export const handleHelp: CommandHandler = async (Becca, interaction, t) => {
  try {
    const helpEmbed = new MessageEmbed();
    helpEmbed.setTitle(t("commands:becca.help.title"));
    helpEmbed.setDescription(t("commands:becca.help.description"));
    helpEmbed.addField(
      t("commands:becca.help.support.title"),
      t("commands:becca.help.support.description")
    );
    helpEmbed.addField(
      t("commands:becca.help.docs.title"),
      t("commands:becca.help.docs.description")
    );
    helpEmbed.addField(
      t("commands:becca.help.source.title"),
      t("commands:becca.help.source.description")
    );
    helpEmbed.addField(
      t("commands:becca.help.bug.title"),
      t("commands:becca.help.bug.description")
    );
    helpEmbed.addField(
      t("commands:becca.help.privacy.title"),
      t("commands:becca.help.privacy.description")
    );
    helpEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
    });

    const supportServerButton = new MessageButton()
      .setLabel(t("commands:becca.help.buttons.support"))
      .setEmoji("<:BeccaHuh:877278300739887134>")
      .setStyle("LINK")
      .setURL("https://chat.nhcarrigan.com");
    const inviteButton = new MessageButton()
      .setLabel(t("commands:becca.help.buttons.invite"))
      .setEmoji("<:BeccaHello:867102882791424073>")
      .setStyle("LINK")
      .setURL("https://invite.beccalyria.com");
    const codeButton = new MessageButton()
      .setLabel(t("commands:becca.help.buttons.source"))
      .setEmoji("<:BeccaNotes:883854700762505287>")
      .setStyle("LINK")
      .setURL("https://github.com/beccalyria/discord-bot");
    const docsButton = new MessageButton()
      .setLabel(t("commands:becca.help.buttons.docs"))
      .setEmoji("<:BeccaSalute:872577687590420501>")
      .setStyle("LINK")
      .setURL("https://docs.beccalyria.com");
    const reportButton = new MessageButton()
      .setLabel(t("commands:becca.help.buttons.issue"))
      .setEmoji("<:BeccaBan:897545793886634085>")
      .setStyle("LINK")
      .setURL("https://github.com/beccalyria/discord-bot/issues/new/choose");

    const row = new MessageActionRow().addComponents([
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
