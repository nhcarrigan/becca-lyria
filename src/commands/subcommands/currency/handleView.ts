/* eslint-disable jsdoc/require-param */
import { EmbedBuilder } from "discord.js";

import { CurrencyHandler } from "../../../interfaces/commands/CurrencyHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { parseSeconds } from "../../../utils/parseSeconds";

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
    const dailyCooldown = Math.round(
      (data.dailyClaimed - now + 86400000) / 1000
    );
    const weeklyCooldown = Math.round(
      (data.weeklyClaimed - now + 604800000) / 1000
    );

    const viewEmbed = new EmbedBuilder();
    viewEmbed.setTitle("Currency Report");
    viewEmbed.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() });
    viewEmbed.setColor(Becca.colours.default);
    viewEmbed.setDescription(
      t("commands:currency.view.total", { total: data.currencyTotal })
    );
    viewEmbed.addFields([
      {
        name: t("commands:currency.view.daily"),
        value: dailyCooldown < 0 ? "now!" : parseSeconds(dailyCooldown),
        inline: true,
      },
      {
        name: t("commands:currency.view.weekly"),
        value: weeklyCooldown < 0 ? "now!" : parseSeconds(weeklyCooldown),
        inline: true,
      },
    ]);
    viewEmbed.setFooter({
      text: t("defaults:donate"),
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
