/* eslint-disable jsdoc/require-param */
import axios from "axios";
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { Joke } from "../../../../interfaces/commands/games/Joke";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Generates an embed containing a random joke.
 */
export const handleJoke: CommandHandler = async (Becca, interaction, t) => {
  try {
    const joke = await axios.get<Joke>(
      "https://api.heptagrambotproject.com/api/v0/jokes/random",
      {
        headers: {
          Authorization: "Bearer " + Becca.configs.heptagramApiToken,
        },
      }
    );

    if (!joke.data || joke.data.status !== 200) {
      await interaction.editReply({
        content: t("commands:games.joke.no"),
      });
      return;
    }

    const jokeEmbed = new MessageEmbed();
    jokeEmbed.setColor(Becca.colours.default);
    jokeEmbed.setTitle(t("commands:games.joke.title"));
    jokeEmbed.setDescription(joke.data.joke);
    jokeEmbed.setTimestamp();
    jokeEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
    });
    await interaction.editReply({ embeds: [jokeEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "joke command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "joke", errorId, t)],
    });
  }
};
