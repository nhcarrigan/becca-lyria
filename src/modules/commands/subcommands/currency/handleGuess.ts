/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CurrencyHandler } from "../../../../interfaces/commands/CurrencyHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Generates a random number between 1 and 100. If the user's `guess` matches that number,
 * increases their currency by `wager`. Otherwise, decreases it.
 */
export const handleGuess: CurrencyHandler = async (
  Becca,
  interaction,
  data
) => {
  try {
    const wager = interaction.options.getInteger("wager", true);
    const guess = interaction.options.getInteger("guess", true);

    if (wager > data.currencyTotal) {
      await interaction.editReply("You cannot wager more coin than you have!");
      return;
    }

    const becca = Math.ceil(Math.random() * 100);
    const won = guess === becca;

    if (won) {
      data.currencyTotal += wager;
    } else {
      data.currencyTotal -= wager;
    }

    await data.save();

    const embed = new MessageEmbed();
    embed.setTitle(won ? "You won!" : "You lost!");
    embed.setColor(won ? Becca.colours.success : Becca.colours.error);
    embed.setDescription(`Your BeccaCoin: ${data.currencyTotal}`);
    embed.addField("Your Guess", guess.toString(), true);
    embed.addField("Becca's Number", becca.toString(), true);
    embed.setFooter("Like the bot? Donate: https://donate.nhcarrigan.com");

    await interaction.editReply({ embeds: [embed] });

    await Becca.currencyHook.send(
      `${interaction.user.username} played guess in ${
        interaction.guild?.name
      }! They ${won ? "won" : "lost"} ${wager} BeccaCoin.`
    );
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "guess command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "guess", errorId)],
    });
  }
};
