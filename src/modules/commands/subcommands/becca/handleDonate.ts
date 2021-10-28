/* eslint-disable jsdoc/require-param */
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Generates an embed containing the various links through which a user
 * can sponsor Becca's development.
 */
export const handleDonate: CommandHandler = async (Becca, interaction) => {
  try {
    const sponsorEmbed = new MessageEmbed();
    sponsorEmbed.setTitle("Sponsor my development!");
    sponsorEmbed.setColor(Becca.colours.default);
    sponsorEmbed.setDescription(
      "Did you know I accept donations? These funds help me learn new spells, improve my current abilities, and allow me to serve you better."
    );
    sponsorEmbed.setFooter(
      "Join our Discord to get perks when you become a monthly sponsor!"
    );

    const githubButton = new MessageButton()
      .setLabel("Donate on GitHub!")
      .setStyle("LINK")
      .setURL("https://github.com/sponsors/nhcarrigan");
    const patreonButton = new MessageButton()
      .setLabel("Donate on Patreon!")
      .setStyle("LINK")
      .setURL("https://www.patreon.com/nhcarrigan");
    const paypalButton = new MessageButton()
      .setLabel("Donate on Paypal!")
      .setStyle("LINK")
      .setURL("https://paypal.me/nhcarrigan");

    const row = new MessageActionRow().addComponents([
      githubButton,
      patreonButton,
      paypalButton,
    ]);

    await interaction.editReply({ embeds: [sponsorEmbed], components: [row] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "donate command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "donate", errorId)],
    });
  }
};
