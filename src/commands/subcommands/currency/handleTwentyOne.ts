import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
  time,
  TimestampStyles,
} from "discord.js";
import { TFunction } from "i18next";

import { CurrencyHandler } from "../../../interfaces/commands/CurrencyHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

const playerLost = (player: number, dealer: number, action: "hit" | "stand") =>
  player > 21 || (action === "stand" && dealer > player);
const playerWon = (player: number, dealer: number) =>
  dealer > 21 || (dealer > 16 && player > dealer && player <= 21);
const playerTied = (player: number, dealer: number, action: "hit" | "stand") =>
  player === dealer && action === "stand";

const getGameState = (
  player: number,
  dealer: number,
  action: "hit" | "stand"
) => {
  if (playerLost(player, dealer, action)) {
    return { won: false, over: true, tied: false };
  }
  if (playerWon(player, dealer)) {
    return { won: true, over: true, tied: false };
  }
  if (playerTied(player, dealer, action)) {
    return { won: false, over: true, tied: true };
  }
  return { won: false, over: false, tied: false };
};

const parseTitle = (
  { won, tied }: { won: boolean; tied: boolean },
  t: TFunction
) => {
  if (tied) {
    return "Tie!";
  }
  return won
    ? t("commands:currency.twentyone.won")
    : t("commands:currency.twentyone.lost");
};

const parseWebhook = (
  { won, tied }: { won: boolean; tied: boolean },
  wager: number
) => `They ${tied ? "tied" : won ? "won" : "lost"} ${wager} BeccaCoin.`;

/**
 * Allows a user to play a game of 21 with Becca, similar to Blackjack. If the user
 * wins, increases their currency by `wager`. Otherwise decreases it.
 * Can be used once an hour.
 */
export const handleTwentyOne: CurrencyHandler = async (
  Becca,
  interaction,
  t,
  data
) => {
  try {
    const wager = interaction.options.getInteger("wager");

    if (!wager || wager < 1) {
      await interaction.editReply(t("commands:currency.twentyone.nowager"));
      return;
    }

    if (wager > data.currencyTotal) {
      await interaction.editReply(
        t("commands:currency.twentyone.insufficient")
      );
      return;
    }

    const now = Date.now();
    const canPlay = now - 3600000 > data.twentyOnePlayed;

    if (!canPlay) {
      const cooldown = data.twentyOnePlayed - now + 3600000;
      const cooldownDate = new Date(data.twentyOnePlayed + cooldown);
      const remainingTimeDesc = t("commands:currency.twentyone.cooldown", {
        time: time(cooldownDate, TimestampStyles.RelativeTime),
        interpolation: { escapeValue: false },
      });
      await interaction.editReply({
        content: remainingTimeDesc,
      });
      return;
    }

    const gameState = { won: false, over: false, tied: false };

    let dealer = Math.ceil(Math.random() * 10);
    let player = Math.ceil(Math.random() * 10);

    const gameEmbed = new EmbedBuilder();
    gameEmbed.setTitle(t("commands:currency.twentyone.title"));
    gameEmbed.setDescription(t("commands:currency.twentyone.description"));
    gameEmbed.setColor(Becca.colours.default);
    gameEmbed.addFields([
      {
        name: t("commands:currency.twentyone.player"),
        value: player.toString(),
        inline: true,
      },
      {
        name: t("commands:currency.twentyone.becca"),
        value: dealer.toString(),
        inline: true,
      },
    ]);
    const hitButton = new ButtonBuilder()
      .setCustomId("hit")
      .setEmoji("<:BeccaThumbsup:875129902997860393>")
      .setLabel(t("commands:currency.twentyone.hit"))
      .setStyle(ButtonStyle.Success);
    const standButton = new ButtonBuilder()
      .setCustomId("stand")
      .setEmoji("<:BeccaYikes:877278299066347632>")
      .setLabel(t("commands:currency.twentyone.stand"))
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
      hitButton,
      standButton,
    ]);

    const message = (await interaction.editReply({
      embeds: [gameEmbed],
      components: [row],
    })) as Message;

    const collector = message.createMessageComponentCollector({
      filter: (click) => click.user.id === interaction.user.id,
      time: 600000,
    });

    collector.on("collect", async (click) => {
      await click.deferUpdate();
      if (click.customId !== "hit" && click.customId !== "stand") {
        return;
      }
      switch (click.customId) {
        case "hit":
          player += Math.ceil(Math.random() * 10);
          if (player > 21) {
            break;
          }
          if (dealer < 16) {
            dealer += Math.ceil(Math.random() * 10);
          }
          break;
        case "stand":
          while (dealer <= 16) {
            dealer += Math.ceil(Math.random() * 10);
          }
      }
      const { over, won, tied } = getGameState(player, dealer, click.customId);
      gameState.over = over;
      gameState.won = won;
      gameState.tied = tied;
      const newHitButton = new ButtonBuilder()
        .setCustomId("hit")
        .setEmoji("<:BeccaThumbsup:875129902997860393>")
        .setLabel(t("commands:currency.twentyone.hit"))
        .setStyle(ButtonStyle.Success);
      const newStandButton = new ButtonBuilder()
        .setCustomId("stand")
        .setEmoji("<:BeccaYikes:877278299066347632>")
        .setLabel(t("commands:currency.twentyone.stand"))
        .setStyle(ButtonStyle.Primary);

      if (gameState.over) {
        newHitButton.setDisabled(true);
        newStandButton.setDisabled(true);
        gameEmbed.setTitle(parseTitle(gameState, t));
        if (player !== dealer) {
          data.currencyTotal = gameState.won
            ? data.currencyTotal + wager
            : data.currencyTotal - wager;
        }
        data.twentyOnePlayed = now;
        await Becca.db.currencies.update({
          where: {
            userId: data.userId,
          },
          data: {
            currencyTotal: data.currencyTotal,
            twentyOnePlayed: data.twentyOnePlayed,
          },
        });
        gameEmbed.setDescription(
          t("commands:currency.twentyone.total", {
            total: data.currencyTotal,
          })
        );
        await Becca.currencyHook.send(
          `${interaction.user.username} played 21 in ${
            interaction.guild?.name
          }! ${parseWebhook(gameState, wager)}`
        );
      }

      const newRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
        newHitButton,
        newStandButton,
      ]);

      gameEmbed.setFields(
        {
          name: t("commands:currency.twentyone.player"),
          value: player.toString(),
          inline: true,
        },
        {
          name: t("commands:currency.twentyone.becca"),
          value: dealer.toString(),
          inline: true,
        }
      );

      await interaction.editReply({
        embeds: [gameEmbed],
        components: [newRow],
      });
    });

    collector.on("end", async () => {
      await interaction.editReply({
        content: t("commands:currency.twentyone.expired"),
        embeds: [],
        components: [],
      });

      if (!gameState.over) {
        data.currencyTotal -= wager;
        data.twentyOnePlayed = now;
        await Becca.db.currencies.update({
          where: {
            userId: data.userId,
          },
          data: {
            currencyTotal: data.currencyTotal,
            twentyOnePlayed: data.twentyOnePlayed,
          },
        });
        await Becca.currencyHook.send(
          `${interaction.user.username} played 21 in ${interaction.guild?.name}! They timed out and lost ${wager} BeccaCoin.`
        );
      }
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "twenty one command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "twenty one", errorId, t)],
    });
  }
};
