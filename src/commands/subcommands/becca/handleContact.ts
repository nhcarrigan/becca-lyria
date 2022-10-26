/*eslint-disable jsdoc/require-param */
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Returns a bit of text and some buttons with the different ways to contact the developer team.
 */
export const handleContact: CommandHandler = async (Becca, interaction, t) => {
  try {
    const discordButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel(t<string, string>("commands:becca.contact.buttons.support"))
      .setURL("https://chat.nhcarrigan.com");
    const twitterButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel(t<string, string>("commands:becca.contact.buttons.twitter"))
      .setURL("https://twitter.com/becca_lyria");
    const githubButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel(t<string, string>("commands:becca.contact.buttons.github"))
      .setURL("https://github.com/BeccaLyria/discord-bot");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
      discordButton,
      twitterButton,
      githubButton,
    ]);
    await interaction.editReply({
      content: t<string, string>("commands:becca.contact.content"),
      components: [row],
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "contact command",
      err,
      interaction.guild?.name
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "contact", errorId, t)],
    });
  }
};
