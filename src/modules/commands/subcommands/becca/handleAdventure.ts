/* eslint-disable jsdoc/require-param */
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

import { adventureList } from "../../../../config/commands/adventureList";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Using the adventureList config, selects a random adventure object and parses it
 * into an embed. The actual images are fetched from Becca's profile site.
 */
export const handleAdventure: CommandHandler = async (Becca, interaction) => {
  try {
    const random = Math.floor(Math.random() * adventureList.length);
    const { fileName, gameName, gameUrl } = adventureList[random];

    const adventureEmbed = new MessageEmbed();
    adventureEmbed.setTitle(gameName);
    adventureEmbed.setColor(Becca.colours.default);
    adventureEmbed.setDescription(
      `This adventure took place in [${gameName}](${gameUrl})`
    );
    adventureEmbed.setImage(
      `https://www.beccalyria.com/assets/games/${fileName.replace(
        /\s/g,
        "%20"
      )}`
    );
    adventureEmbed.setFooter(
      "Like the bot? Donate: https://donate.nhcarrigan.com",
      "https://cdn.nhcarrigan.com/profile-transparent.png"
    );

    const artButton = new MessageButton()
      .setLabel("View More Adventures!")
      .setEmoji("<:BeccaWork:883854701416833024>")
      .setStyle("LINK")
      .setURL("https://www.beccalyria.com/games");

    const row = new MessageActionRow().addComponents([artButton]);

    await interaction.editReply({
      embeds: [adventureEmbed],
      components: [row],
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "adventure command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "adventure", errorId)],
    });
  }
};
