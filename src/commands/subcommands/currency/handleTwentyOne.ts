/* eslint-disable jsdoc/require-param */
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
} from "discord.js";

import { CurrencyHandler } from "../../../interfaces/commands/CurrencyHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { parseSeconds } from "../../../utils/parseSeconds";

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
      await interaction.editReply(
        t<string, string>("commands:currency.twentyone.nowager")
      );
      return;
    }

    if (wager > data.currencyTotal) {
      await interaction.editReply(
        t<string, string>("commands:currency.twentyone.insufficient")
      );
      return;
    }

    const now = Date.now();
    const canPlay = now - 3600000 > data.twentyOnePlayed;

    if (!canPlay) {
      const cooldown = data.twentyOnePlayed - now + 3600000;
      await interaction.editReply({
        content: t<string, string>("commands:currency.twentyone.cooldown", {
          time: parseSeconds(Math.ceil(cooldown / 1000)),
        }),
      });
      return;
    }

    const gameState = { won: false, over: false };

    let dealer = Math.ceil(Math.random() * 10);
    let player = Math.ceil(Math.random() * 10);

    const gameEmbed = new EmbedBuilder();
    gameEmbed.setTitle(t<string, string>("commands:currency.twentyone.title"));
    gameEmbed.setDescription(
      t<string, string>("commands:currency.twentyone.description")
    );
    gameEmbed.setColor(Becca.colours.default);
    gameEmbed.addFields([
      {
        name: t<string, string>("commands:currency.twentyone.player"),
        value: player.toString(),
        inline: true,
      },
      {
        name: t<string, string>("commands:currency.twentyone.becca"),
        value: dealer.toString(),
        inline: true,
      },
    ]);
    const hitButton = new ButtonBuilder()
      .setCustomId("hit")
      .setEmoji("<:BeccaThumbsup:875129902997860393>")
      .setLabel(t<string, string>("commands:currency.twentyone.hit"))
      .setStyle(ButtonStyle.Success);
    const standButton = new ButtonBuilder()
      .setCustomId("stand")
      .setEmoji("<:BeccaYikes:877278299066347632>")
      .setLabel(t<string, string>("commands:currency.twentyone.stand"))
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
      if (player > 21 || (click.customId === "stand" && dealer > player)) {
        gameState.over = true;
        gameState.won = false;
      }
      if (dealer > 21 || (dealer > 16 && player > dealer && player <= 21)) {
        gameState.over = true;
        gameState.won = true;
      }
      if (player === dealer && click.customId === "stand") {
        gameState.over = true;
      }
      const newHitButton = new ButtonBuilder()
        .setCustomId("hit")
        .setEmoji("<:BeccaThumbsup:875129902997860393>")
        .setLabel(t<string, string>("commands:currency.twentyone.hit"))
        .setStyle(ButtonStyle.Success);
      const newStandButton = new ButtonBuilder()
        .setCustomId("stand")
        .setEmoji("<:BeccaYikes:877278299066347632>")
        .setLabel(t<string, string>("commands:currency.twentyone.stand"))
        .setStyle(ButtonStyle.Primary);

      if (gameState.over) {
        newHitButton.setDisabled(true);
        newStandButton.setDisabled(true);
        gameEmbed.setTitle(
          player === dealer
            ? "Tie!"
            : gameState.won
            ? t<string, string>("commands:currency.twentyone.won")
            : t<string, string>("commands:currency.twentyone.lost")
        );
        if (player !== dealer) {
          data.currencyTotal = gameState.won
            ? data.currencyTotal + wager
            : data.currencyTotal - wager;
        }
        data.twentyOnePlayed = now;
        await data.save();
        gameEmbed.setDescription(
          t<string, string>("commands:currency.twentyone.total", {
            total: data.currencyTotal,
          })
        );
        await Becca.currencyHook.send(
          `${interaction.user.username} played 21 in ${
            interaction.guild?.name
          }! They ${
            player === dealer ? "tied" : gameState.won ? "won" : "lost"
          } ${wager} BeccaCoin.`
        );
      }

      const newRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
        newHitButton,
        newStandButton,
      ]);

      gameEmbed.setFields(
        {
          name: t<string, string>("commands:currency.twentyone.player"),
          value: player.toString(),
          inline: true,
        },
        {
          name: t<string, string>("commands:currency.twentyone.becca"),
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
        content: t<string, string>("commands:currency.twentyone.expired"),
        embeds: [],
        components: [],
      });

      if (!gameState.over) {
        data.currencyTotal -= wager;
        data.twentyOnePlayed = now;
        await data.save();
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
