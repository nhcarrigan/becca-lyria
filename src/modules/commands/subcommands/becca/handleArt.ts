/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { artList } from "../../../../config/commands/artList";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Using the artList config, selects a random art object and parses it
 * into an embed. The actual images are fetched from Becca's profile site.
 */
export const handleArt: CommandHandler = async (Becca, interaction) => {
  try {
    const random = Math.floor(Math.random() * artList.length);
    const { fileName, artName, artist, artistUrl } = artList[random];

    const artEmbed = new MessageEmbed();
    artEmbed.setTitle(artName);
    artEmbed.setColor(Becca.colours.default);
    artEmbed.setDescription(
      `This portrait of me was done by [${artist}](${artistUrl})`
    );
    artEmbed.setImage(
      `https://www.beccalyria.com/assets/art/${fileName.replace(/\s/g, "%20")}`
    );
    artEmbed.setFooter("Like the bot? Donate: https://donate.nhcarrigan.com");

    await interaction.editReply({ embeds: [artEmbed] });
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
      embeds: [errorEmbedGenerator(Becca, "art", errorId)],
    });
  }
};
