/* eslint-disable jsdoc/require-param */
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getCounts } from "../../../modules/becca/getCounts";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";

/**
 * Generates an embed containing information about Becca.
 */
export const handleAbout: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { guilds, members, commands } = getCounts(Becca);
    const aboutEmbed = new MessageEmbed();
    aboutEmbed.setColor(Becca.colours.default);
    aboutEmbed.setTitle(t("commands:becca.about.title"));
    aboutEmbed.setDescription(t("commands:becca.about.description"));
    aboutEmbed.addField(
      t("commands:becca.about.version"),
      process.env.npm_package_version || "unknown version",
      true
    );
    aboutEmbed.addField(
      t("commands:becca.about.creation"),
      "Sunday, 31 May 2020",
      true
    );
    aboutEmbed.addField(
      t("commands:becca.about.guilds"),
      guilds.toString(),
      true
    );
    aboutEmbed.addField(
      t("commands:becca.about.members"),
      members.toString(),
      true
    );
    aboutEmbed.addField(
      t("commands:becca.about.commands"),
      commands.toString(),
      true
    );
    aboutEmbed.addField(
      t("commands:becca.about.colour"),
      t("commands:becca.about.purple"),
      true
    );
    aboutEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
    });

    const supportServerButton = new MessageButton()
      .setLabel(t("commands:becca.about.buttons.join"))
      .setEmoji("<:BeccaHuh:877278300739887134>")
      .setStyle("LINK")
      .setURL("https://chat.nhcarrigan.com");
    const inviteButton = new MessageButton()
      .setLabel(t("commands:becca.about.buttons.invite"))
      .setEmoji("<:BeccaHello:867102882791424073>")
      .setStyle("LINK")
      .setURL("https://invite.beccalyria.com");
    const codeButton = new MessageButton()
      .setLabel(t("commands:becca.about.buttons.code"))
      .setEmoji("<:BeccaNotes:883854700762505287>")
      .setStyle("LINK")
      .setURL("https://github.com/beccalyria/discord-bot");

    const row = new MessageActionRow().addComponents([
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
