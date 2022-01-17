/* eslint-disable jsdoc/require-param */
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Generates an embed containing the various links through which a user
 * can sponsor Becca's development.
 */
export const handleDonate: CommandHandler = async (Becca, interaction, t) => {
  try {
    const sponsorEmbed = new MessageEmbed();
    sponsorEmbed.setTitle(t("commands:becca.donate.title"));
    sponsorEmbed.setColor(Becca.colours.default);
    sponsorEmbed.setDescription(t("commands:becca.donate.description"));
    sponsorEmbed.setFooter({
      text: t("commands:becca.donate.footer"),
    });

    const githubButton = new MessageButton()
      .setLabel(t("commands:becca.donate.buttons.github"))
      .setStyle("LINK")
      .setURL("https://github.com/sponsors/nhcarrigan");
    const patreonButton = new MessageButton()
      .setLabel(t("commands:becca.donate.buttons.patreon"))
      .setStyle("LINK")
      .setURL("https://www.patreon.com/nhcarrigan");
    const paypalButton = new MessageButton()
      .setLabel("commands:becca.donate.buttons.paypal")
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
