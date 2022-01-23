/*eslint-disable jsdoc/require-param */
import { MessageActionRow, MessageButton } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Returns a bit of text and some buttons with the different ways to contact the developer team.
 */
export const handleContact: CommandHandler = async (Becca, interaction, t) => {
  try {
    const discordButton = new MessageButton()
      .setStyle("LINK")
      .setLabel(t("commands:becca.contact.buttons.support"))
      .setURL("https://chat.nhcarrigan.com");
    const twitterButton = new MessageButton()
      .setStyle("LINK")
      .setLabel(t("commands:becca.contact.buttons.twitter"))
      .setURL("https://twitter.com/becca_lyria");
    const githubButton = new MessageButton()
      .setStyle("LINK")
      .setLabel(t("commands:becca.contact.buttons.github"))
      .setURL("https://github.com/BeccaLyria/discord-bot");

    const row = new MessageActionRow().addComponents([
      discordButton,
      twitterButton,
      githubButton,
    ]);
    await interaction.editReply({
      content: t("commands:becca.contact.content"),
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
