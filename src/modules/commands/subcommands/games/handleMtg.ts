/* eslint-disable jsdoc/require-param */
import axios from "axios";
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { MtgInt } from "../../../../interfaces/commands/games/MtgInt";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Fetches data from a Magic: The Gathering API to get information on
 * the `card`, and parses it into an embed.
 */
export const handleMtg: CommandHandler = async (Becca, interaction) => {
  try {
    const query = interaction.options.getString("card");

    const cards = await axios.get<MtgInt>(
      `https://api.magicthegathering.io/v1/cards?name=${query}&pageSize=1`
    );

    if (!cards.data || !cards.data.cards.length) {
      await interaction.editReply({
        content: "That card does not seem to exist...",
      });
      return;
    }

    const card = cards.data.cards[0];

    const cardEmbed = new MessageEmbed();
    cardEmbed.setColor(Becca.colours.default);
    cardEmbed.setTitle(card.name);
    cardEmbed.setImage(
      card.imageUrl || "https://cdn.nhcarrigan.com/content/projects/mtg.jpg"
    );
    cardEmbed.setDescription(card.flavor || "This card has no flavour text...");
    cardEmbed.addField("Types", card.types.join(", "));
    cardEmbed.addField("Cost", card.manaCost);
    cardEmbed.addField(
      "Abilities",
      card.text || "This card has no ability text..."
    );

    await interaction.editReply({ embeds: [cardEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "mtg command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "mtg", errorId)],
        ephemeral: true,
      })
      .catch(
        async () =>
          await interaction.editReply({
            embeds: [errorEmbedGenerator(Becca, "mtg", errorId)],
          })
      );
  }
};
