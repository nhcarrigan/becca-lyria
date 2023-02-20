/* eslint-disable jsdoc/require-param */
import { EmbedBuilder } from "discord.js";

import { CurrencyHandler } from "../../../interfaces/commands/CurrencyHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { parseSeconds } from "../../../utils/parseSeconds";
import { scheduleCurrencyReminder } from "../../../utils/scheduleCurrencyReminder";

/**
 * Confirms that a user has not used the command within the last 24 hours, then
 * grants them a random currency bonus between 0 and 24.
 */
export const handleDaily: CurrencyHandler = async (
  Becca,
  interaction,
  t,
  data
) => {
  try {
    const now = Date.now();
    const canClaim = now - 86400000 > data.dailyClaimed;

    if (!canClaim) {
      const cooldown = data.dailyClaimed - now + 86400000;
      await interaction.editReply({
        content: t<string, string>("commands:currency.daily.cooldown", {
          time: parseSeconds(Math.ceil(cooldown / 1000)),
        }),
      });
      return;
    }

    const earnedCurrency = Math.ceil(Math.random() * 50) + 50;

    data.currencyTotal += earnedCurrency;
    data.dailyClaimed = now;
    await data.save();

    await scheduleCurrencyReminder(
      Becca,
      86400000,
      t<string, string>("commands:currency.daily.reminder", {
        user: `<@!${data.userId}>`,
      })
    );

    const embed = new EmbedBuilder();
    embed.setTitle(t<string, string>("commands:currency.daily.title"));
    embed.setDescription(
      t<string, string>("commands:currency.daily.description", {
        earned: earnedCurrency,
        total: data.currencyTotal,
      })
    );
    embed.setColor(Becca.colours.default);
    embed.setFooter({
      text: t<string, string>("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

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
      embeds: [errorEmbedGenerator(Becca, "daily", errorId, t)],
    });
  }
};
