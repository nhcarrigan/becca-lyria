import { EmbedBuilder, time, TimestampStyles } from "discord.js";

import { slotsList } from "../../../config/commands/slotsList";
import { CurrencyHandler } from "../../../interfaces/commands/CurrencyHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Confirms that the user has not used this command within the last hour, then
 * selects three random emotes from the slotsList. If the three emotes match, increases
 * the user's currency by `wager`. Otherwise, decreases it.
 */
export const handleSlots: CurrencyHandler = async (
  Becca,
  interaction,
  t,
  data
) => {
  try {
    const hourInMillseconds = 3600000;

    const wager = interaction.options.getInteger("wager");

    if (!wager || wager < 1) {
      await interaction.editReply(t("commands:currency.slots.nowager"));
      return;
    }

    if (wager > data.currencyTotal) {
      await interaction.editReply(t("commands:currency.slots.insufficient"));
      return;
    }

    const now = Date.now();
    const canPlay = now - hourInMillseconds > data.slotsPlayed;

    if (!canPlay) {
      const cooldown = data.slotsPlayed + hourInMillseconds;
      const cooldownDate = new Date(data.slotsPlayed + cooldown);
      const remainingTimeDesc = t("commands:currency.slots.cooldown", {
        time: time(cooldownDate, TimestampStyles.RelativeTime),
        interpolation: { escapeValue: false },
      });
      await interaction.editReply({
        content: remainingTimeDesc,
      });
      return;
    }

    const first = getRandomValue(slotsList);
    const second = getRandomValue(slotsList);
    const third = getRandomValue(slotsList);

    const didWin = first === second && second === third;
    const partialWin = first === second || second === third || first === third;

    let change = 0 - wager;
    if (partialWin) {
      change = wager * 10;
    }
    if (didWin) {
      change = wager * 100;
    }

    data.currencyTotal = data.currencyTotal + change;

    await Becca.db.currencies.update({
      where: {
        userId: data.userId,
      },
      data: {
        currencyTotal: data.currencyTotal,
        slotsPlayed: now,
      },
    });

    const slotEmbed = new EmbedBuilder();
    slotEmbed.setTitle(
      didWin || partialWin
        ? t("commands:currency.slots.won")
        : t("commands:currency.slots.lost")
    );
    slotEmbed.setColor(
      didWin || partialWin ? Becca.colours.success : Becca.colours.error
    );
    slotEmbed.setDescription(
      t("commands:currency.slots.total", {
        total: data.currencyTotal,
      })
    );
    slotEmbed.setFooter({
      text: t("commands:currency.slots.footer"),
    });

    await interaction.editReply({
      content: `${first} ${second} ${third}`,
      embeds: [slotEmbed],
    });

    await Becca.currencyHook.send(
      `${interaction.user.username} played slots in ${
        interaction.guild?.name
      }! They ${didWin || partialWin ? "won" : "lost"} ${change} BeccaCoin.`
    );
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "slots command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "slots", errorId, t)],
    });
  }
};
