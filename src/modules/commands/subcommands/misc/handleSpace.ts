/* eslint-disable jsdoc/require-param */
import axios from "axios";
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { Space } from "../../../../interfaces/commands/general/Space";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../../utils/customSubstring";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Fetches the latest Astronomy Photo of the Day from NASA, or the photo from
 * the given `date`.
 */
export const handleSpace: CommandHandler = async (Becca, interaction) => {
  try {
    if (!Becca.configs.nasaKey) {
      throw new Error("no nasaKey configured");
    }
    const date = interaction.options.getString("date");
    let url = `https://api.nasa.gov/planetary/apod?api_key=${Becca.configs.nasaKey}`;

    if (date) {
      if (!/[\d]{4}-[\d]{2}-[\d]{2}/.test(date)) {
        interaction.editReply({
          content: `${date} is not a valid date format.`,
        });
        return;
      }
      url += `&date=${date}`;
    }

    const spaceEmbed = new MessageEmbed();
    spaceEmbed.setTimestamp();

    const space = await axios.get<Space>(url, { validateStatus: null });
    if (!space.data || space.status !== 200) {
      spaceEmbed.setTitle("SPAAAAAAACE");
      spaceEmbed.setDescription("I got lost in space. Please try agian later.");
      spaceEmbed.setColor(Becca.colours.error);
      await interaction.editReply({ embeds: [spaceEmbed] });
    }

    spaceEmbed.setTitle(
      `${date || space.data.date} Space Image: ${space.data.title}`
    );
    spaceEmbed.setURL("https://apod.nasa.gov/apod/astropix.html");
    spaceEmbed.setDescription(customSubstring(space.data.explanation, 2000));
    spaceEmbed.setImage(space.data.hdurl);
    spaceEmbed.setFooter(
      `© ${space.data.copyright || "No copyright provided"}`
    );
    interaction.editReply({ embeds: [spaceEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "space command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "space", errorId)],
    });
  }
};
