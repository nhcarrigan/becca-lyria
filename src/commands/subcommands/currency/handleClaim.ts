/* eslint-disable jsdoc/require-param */
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

import { CurrencyHandler } from "../../../interfaces/commands/CurrencyHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Confirms a user has sufficient currency to claim the `reward` they selected. If so,
 * removes the currency from their balance and sends a message to the currency webhook to
 * notify the owner that a reward has been claimed.
 */
export const handleClaim: CurrencyHandler = async (
  Becca,
  interaction,
  t,
  data
) => {
  try {
    const reward = interaction.options.getString("reward");
    const claimEmbed = new MessageEmbed();
    claimEmbed.setTitle("Reward Claimed!");
    claimEmbed.setDescription(
      "Congratulations on claiming a reward! Please note that you will need to join our [support server](https://chat.nhcarrigan.com) and ping Naomi so we can work with you to get your prize."
    );
    claimEmbed.setFooter(
      "Like the bot? Donate: https://donate.nhcarrigan.com",
      "https://cdn.nhcarrigan.com/profile.png"
    );

    switch (reward) {
      case "monarch-colour":
        if (data.currencyTotal < 2500) {
          await interaction.editReply(
            t("commands:currency.claim.price", {
              price: 2500,
              total: data.currencyTotal,
            })
          );
          return;
        }
        data.currencyTotal -= 2500;
        await data.save();
        claimEmbed.addField(
          t("commands:currency.claim.details"),
          t("commands:currency.claim.monarch-colour")
        );
        break;
      case "monarch":
        if (data.currencyTotal < 5000) {
          await interaction.editReply(
            t("commands:currency.claim.price", {
              price: 5000,
              total: data.currencyTotal,
            })
          );
          return;
        }
        data.currencyTotal -= 5000;
        await data.save();
        claimEmbed.addField(
          t("commands:currency.claim.details"),
          t("commands:currency.claim.monarch")
        );
        break;
      case "wealthy-colour":
        if (data.currencyTotal < 7500) {
          await interaction.editReply(
            t("commands:currency.claim.price", {
              price: 7500,
              total: data.currencyTotal,
            })
          );
          return;
        }
        data.currencyTotal -= 7500;
        await data.save();
        claimEmbed.addField(
          t("commands:currency.claim.details"),
          t("commands:currency.claim.wealthy-colour")
        );
        break;
      case "wealthy":
        if (data.currencyTotal < 10000) {
          await interaction.editReply(
            t("commands:currency.claim.price", {
              price: 10000,
              total: data.currencyTotal,
            })
          );
          return;
        }
        data.currencyTotal -= 10000;
        await data.save();
        claimEmbed.addField(
          t("commands:currency.claim.details"),
          t("commands:currency.claim.wealthy")
        );
        break;
      case "default":
        await interaction.editReply(t("commands:currency.claim.invalid"));
        return;
    }

    const supportServerButton = new MessageButton()
      .setLabel(t("commands:currency.claim.buttons"))
      .setEmoji("<:BeccaHuh:877278300739887134>")
      .setStyle("LINK")
      .setURL("https://chat.nhcarrigan.com");
    const row = new MessageActionRow().addComponents([supportServerButton]);

    await interaction.editReply({ embeds: [claimEmbed], components: [row] });

    await Becca.currencyHook.send(
      `Hey <@!${Becca.configs.ownerId}>! A reward has been claimed!\n**Reward**: ${reward}\n**Username**: ${interaction.user.username}\n**UserID**: ${interaction.user.id}\nUser in Server? <@!${interaction.user.id}>`
    );
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "claim command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "claim", errorId, t)],
    });
  }
};
