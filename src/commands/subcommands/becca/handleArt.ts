/* eslint-disable jsdoc/require-param */
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

import { artList } from "../../../config/commands/artList";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Using the artList config, selects a random art object and parses it
 * into an embed. The actual images are fetched from Becca's profile site.
 */
export const handleArt: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { fileName, artName, artist, artistUrl } = getRandomValue(artList);

    const artEmbed = new MessageEmbed();
    artEmbed.setTitle(artName);
    artEmbed.setColor(Becca.colours.default);
    artEmbed.setDescription(
      t("commands:becca.art.description", { artist, url: artistUrl })
    );
    artEmbed.setImage(
      `https://www.beccalyria.com/assets/art/${fileName.replace(/\s/g, "%20")}`
    );
    artEmbed.setFooter(
      "Like the bot? Donate: https://donate.nhcarrigan.com",
      "https://cdn.nhcarrigan.com/profile-transparent.png"
    );

    const artButton = new MessageButton()
      .setLabel(t("commands:becca.art.buttons.more"))
      .setEmoji("<:BeccaArt:897545793655930910>")
      .setStyle("LINK")
      .setURL(
        "https://www.beccalyria.com/gallery?utm_source=discord&utm_medium=art-command"
      );

    const row = new MessageActionRow().addComponents([artButton]);

    await interaction.editReply({ embeds: [artEmbed], components: [row] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "art command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "art", errorId, t)],
    });
  }
};
