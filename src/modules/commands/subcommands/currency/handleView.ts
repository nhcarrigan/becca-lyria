/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CurrencyHandler } from "../../../../interfaces/commands/CurrencyHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { parseSeconds } from "../../../../utils/parseSeconds";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

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

    const viewEmbed = new MessageEmbed();
    viewEmbed.setTitle("Currency Report");
    viewEmbed.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() });
    viewEmbed.setColor(Becca.colours.default);
    viewEmbed.setDescription(
      t("commands:currency.view.total", { total: data.currencyTotal })
    );
    viewEmbed.addField(
      t("commands:currency.view.daily"),
      dailyCooldown < 0 ? "now!" : parseSeconds(dailyCooldown),
      true
    );
    viewEmbed.addField(
      t("commands:currency.view.weekly"),
      weeklyCooldown < 0 ? "now!" : parseSeconds(weeklyCooldown),
      true
    );
    viewEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
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
