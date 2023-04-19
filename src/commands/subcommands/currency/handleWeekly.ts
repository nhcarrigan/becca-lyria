/* eslint-disable jsdoc/require-param */
import { EmbedBuilder, TimestampStyles, time } from "discord.js";

import { CurrencyHandler } from "../../../interfaces/commands/CurrencyHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { scheduleCurrencyReminder } from "../../../utils/scheduleCurrencyReminder";

/**
 * Grants the user a bonus currency amount between 25 and 100. Can be used
 * once every 7 days.
 */
export const handleWeekly: CurrencyHandler = async (
  Becca,
  interaction,
  t,
  data
) => {
  try {
    const now = Date.now();
    const canClaim = now - 604800000 > data.weeklyClaimed;

    const homeServer = await interaction.client.guilds.fetch(
      Becca.configs.homeGuild
    );
    const userIsMember = await homeServer.members
      .fetch(interaction.user.id)
      .catch(() => null);

    if (!userIsMember) {
      const nopeEmbed = new EmbedBuilder();
      nopeEmbed.setTitle(t("commands:currency.weekly.no.title"));
      nopeEmbed.setDescription(t("commands:currency.weekly.no.description"));
      nopeEmbed.setColor(Becca.colours.error);
      await interaction.editReply({ embeds: [nopeEmbed] });
      return;
    }

    if (!canClaim) {
      const cooldown = data.weeklyClaimed - now + 604800000;
      const cooldownDate = new Date(data.weeklyClaimed + cooldown);
      const remainingTimeDesc = t("commands:currency.weekly.cooldown", {
        time: time(cooldownDate, TimestampStyles.RelativeTime),
        interpolation: { escapeValue: false },
      });
      await interaction.editReply({
        content: remainingTimeDesc,
      });
      return;
    }

    const earnedCurrency = Math.ceil(Math.random() * 100 + 100);

    data.currencyTotal += earnedCurrency;
    data.weeklyClaimed = now;
    await data.save();

    await scheduleCurrencyReminder(
      Becca,
      604800000,
      t("commands:currency.weekly.reminder", {
        user: `<@!${data.userId}>`,
      })
    );

    const embed = new EmbedBuilder();
    embed.setTitle(t("commands:currency.weekly.title"));
    embed.setDescription(
      t("commands:currency.weekly.description", {
        earned: earnedCurrency,
        total: data.currencyTotal,
      })
    );
    embed.setColor(Becca.colours.default);

    await interaction.editReply({ embeds: [embed] });
    await Becca.currencyHook.send(
      `**Weekly Reward Claimed!**\n\n*User*: ${interaction.user.username}\n*UserID*: ${interaction.user.id}\n*Server*: ${interaction.guild?.name}\n*ServerID*: ${interaction.guildId}\n*Earned*: ${earnedCurrency} - *Total*: ${data.currencyTotal}`
    );
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "weekly command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "weekly", errorId, t)],
    });
  }
};
