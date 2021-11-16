/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CurrencyHandler } from "../../../../interfaces/commands/CurrencyHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { parseSeconds } from "../../../../utils/parseSeconds";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Confirms that a user has not used the command within the last 24 hours, then
 * grants them a random currency bonus between 0 and 24.
 */
export const handleDaily: CurrencyHandler = async (
  Becca,
  interaction,
  data
) => {
  try {
    const now = Date.now();
    const canClaim = now - 86400000 > data.dailyClaimed;

    if (!canClaim) {
      const cooldown = data.dailyClaimed - now + 86400000;
      await interaction.editReply({
        content: `You have already claimed your daily!\nCome back in: ${parseSeconds(
          Math.ceil(cooldown / 1000)
        )}`,
      });
      return;
    }

    const earnedCurrency = Math.round(Math.random() * 25);

    data.currencyTotal += earnedCurrency;
    data.dailyClaimed = now;
    await data.save();

    const embed = new MessageEmbed();
    embed.setTitle("Daily Reward!");
    embed.setDescription(
      `You've earned ${earnedCurrency} BeccaCoin! You now have ${data.currencyTotal} BeccaCoin.`
    );
    embed.setColor(Becca.colours.default);
    embed.setFooter("Like the bot? Donate: https://donate.nhcarrigan.com");

    await interaction.editReply({ embeds: [embed] });

    await Becca.currencyHook.send(
      `**Daily Reward Claimed!**\n*User*: ${interaction.user.username}\n*UserID*: ${interaction.user.id}\n*Server*: ${interaction.guild?.name}\n*ServerID*: ${interaction.guildId}\n*Earned*: ${earnedCurrency} - *Total*: ${data.currencyTotal}`
    );
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "daily command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "daily", errorId)],
    });
  }
};
