/* eslint-disable jsdoc/require-param */
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Message,
} from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { ArraySettings } from "../../../interfaces/settings/ArraySettings";
import { viewSettings } from "../../../modules/commands/config/viewSettings";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

import { viewSettingsArray } from "./viewSettingsArray";

/**
 * Generates an embed showing the current server `setting` values. If `setting` is global,
 * shows the top-level overview.
 */
export const handleView: CommandHandler = async (
  Becca,
  interaction,
  t,
  config
) => {
  try {
    const { guild } = interaction;

    if (!guild) {
      await interaction.editReply({
        content: getRandomValue(t("responses:missingGuild")),
      });
      return;
    }

    const setting = interaction.options.getString("setting");

    if (setting === "global") {
      const result = await viewSettings(Becca, t, guild, config);
      if (!result) {
        await interaction.editReply({
          content: t("commands:config.view.none"),
        });
        return;
      }
      await interaction.editReply({ embeds: [result] });
      return;
    }

    let page = 1;
    let lastPage = 2;

    let embed = await viewSettingsArray(
      Becca,
      t,
      config,
      setting as ArraySettings,
      1
    );

    if (!embed) {
      await interaction.editReply({
        content: t("commands:config.view.none"),
      });
      return;
    }

    const pageBack = new ButtonBuilder()
      .setCustomId("prev")
      .setDisabled(true)
      .setLabel("◀")
      .setStyle(ButtonStyle.Primary);
    const pageForward = new ButtonBuilder()
      .setCustomId("next")
      .setLabel("▶")
      .setStyle(ButtonStyle.Primary);
    lastPage = parseInt(
      embed?.data?.footer?.text?.split(" ").reverse()[0] || "haha",
      10
    );
    if (lastPage === 1) {
      pageForward.setDisabled(true);
    }

    const sent = (await interaction.editReply({
      embeds: [embed],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          pageBack,
          pageForward
        ),
      ],
    })) as Message;

    const buttonCollector = sent.createMessageComponentCollector({
      time: 60000,
      filter: (click) => click.user.id === interaction.user.id,
    });

    buttonCollector.on("collect", async (click) => {
      click.deferUpdate();
      if (click.customId === "prev") {
        page--;
      }
      if (click.customId === "next") {
        page++;
      }

      if (page <= 1) {
        pageBack.setDisabled(true);
      } else {
        pageBack.setDisabled(false);
      }
      if (page >= lastPage) {
        pageForward.setDisabled(true);
      } else {
        pageForward.setDisabled(false);
      }

      embed = await viewSettingsArray(
        Becca,
        t,
        config,
        setting as ArraySettings,
        page
      );

      if (!embed) {
        await interaction.editReply({
          content: t("commands:config.view.none"),
        });
        return;
      }

      await interaction.editReply({
        embeds: [embed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            pageBack,
            pageForward
          ),
        ],
      });
    });

    buttonCollector.on("end", async () => {
      pageBack.setDisabled(true);
      pageForward.setDisabled(true);
      await interaction.editReply({
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            pageBack,
            pageForward
          ),
        ],
      });
    });
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
