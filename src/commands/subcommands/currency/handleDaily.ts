import { EmbedBuilder, TimestampStyles, time } from "discord.js";

import { CurrencyHandler } from "../../../interfaces/commands/CurrencyHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
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
    const dayInMilliseconds = 86400000;
    const now = Date.now();
    //Has it been more than a day since they last claimed.
    const canClaim = now - dayInMilliseconds > data.dailyClaimed;

    if (!canClaim) {
      // Determine what day it'll be when they can claim again
      const cooldown = data.dailyClaimed + dayInMilliseconds;
      const cooldownDate = new Date(data.dailyClaimed + cooldown);
      const remainingTimeDesc = t("commands:currency.daily.cooldown", {
        time: time(cooldownDate, TimestampStyles.RelativeTime),
        interpolation: { escapeValue: false },
      });
      await interaction.editReply({
        content: remainingTimeDesc,
      });
      return;
    }

    const earnedCurrency = Math.ceil(Math.random() * 50) + 50;

    await Becca.db.currencies.update({
      where: {
        userId: data.userId,
      },
      data: {
        currencyTotal: {
          increment: earnedCurrency,
        },
        dailyClaimed: now,
      },
    });

    await scheduleCurrencyReminder(
      Becca,
      dayInMilliseconds,
      t("commands:currency.daily.reminder", {
        user: `<@!${data.userId}>`,
      })
    );

    const embed = new EmbedBuilder();
    embed.setTitle(t("commands:currency.daily.title"));
    embed.setDescription(
      t("commands:currency.daily.description", {
        earned: earnedCurrency,
        total: data.currencyTotal,
      })
    );
    embed.setColor(Becca.colours.default);
    embed.setFooter({
      text: t("defaults:footer"),
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
