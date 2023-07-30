import { EmbedBuilder, time, TimestampStyles } from "discord.js";

import { CurrencyHandler } from "../../../interfaces/commands/CurrencyHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Generates an embed with the user's current balance, and the cooldowns for
 * the daily and weekly bonuses.
 */
export const handleView: CurrencyHandler = async (
  Becca,
  interaction,
  t,
  data
) => {
  try {
    const { user } = interaction;
    const now = Date.now();

    const viewEmbed = new EmbedBuilder();
    viewEmbed.setTitle("Currency Report");
    viewEmbed.setAuthor({ name: user.username, iconURL: user.displayAvatarURL() });
    viewEmbed.setColor(Becca.colours.default);
    viewEmbed.setDescription(
      t("commands:currency.view.total", {
        total: data.currencyTotal,
      })
    );
    viewEmbed.addFields([
      {
        name: t("commands:currency.view.daily"),
        value:
          data.dailyClaimed + 86400000 < now
            ? "now!"
            : time(
                Math.round((data.dailyClaimed + 86400000) / 1000),
                TimestampStyles.RelativeTime
              ),
        inline: true,
      },
      {
        name: t("commands:currency.view.weekly"),
        value:
          data.weeklyClaimed + 604800000 < now
            ? "now!"
            : time(
                Math.round((data.weeklyClaimed + 604800000) / 1000),
                TimestampStyles.RelativeTime
              ),
        inline: true,
      },
    ]);
    viewEmbed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await interaction.editReply({ embeds: [viewEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "view command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "view", errorId, t)],
    });
  }
};
