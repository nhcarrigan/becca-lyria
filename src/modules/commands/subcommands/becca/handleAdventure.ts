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
export const handleAdventure: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const random = Math.floor(Math.random() * adventureList.length);
    const { fileName, gameName, gameUrl } = adventureList[random];

    const adventureEmbed = new MessageEmbed();
    adventureEmbed.setTitle(gameName);
    adventureEmbed.setColor(Becca.colours.default);
    adventureEmbed.setDescription(
      t("commands:becca.adventure.description", {
        name: gameName,
        url: gameUrl,
      })
    );
    adventureEmbed.setImage(
      `https://www.beccalyria.com/assets/games/${fileName.replace(
        /\s/g,
        "%20"
      )}`
    );
    adventureEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
    });

    const artButton = new MessageButton()
      .setLabel(t("commands:becca.adventure.buttons.more"))
      .setEmoji("<:BeccaWork:883854701416833024>")
      .setStyle("LINK")
      .setURL("https://beccalyria.com/adventures");

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
      embeds: [errorEmbedGenerator(Becca, "adventure", errorId, t)],
    });
  }
};
