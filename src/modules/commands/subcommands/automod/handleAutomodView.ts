/* eslint-disable jsdoc/require-param */
import { Message, MessageActionRow, MessageButton } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { ArraySettings } from "../../../../interfaces/settings/ArraySettings";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";
import { viewAutomodSettings } from "../../automod/viewAutomodSettings";
import { viewSettingsArray } from "../config/viewSettingsArray";

/**
 * Generates an embed showing the current server `setting` values. If `setting` is global,
 * shows the top-level overview.
 */
export const handleAutomodView: CommandHandler = async (
  Becca,
  interaction,
  config
) => {
  try {
    const { guild } = interaction;

    if (!guild) {
      await interaction.editReply({ content: Becca.responses.missingGuild });
      return;
    }

    const setting = interaction.options.getString("setting");

    if (setting === "global") {
      const result = viewAutomodSettings(Becca, guild, config);
      if (!result) {
        await interaction.editReply({
          content: "I am unable to locate your settings.",
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
      config,
      setting as ArraySettings,
      1
    );

    if (!embed) {
      await interaction.editReply({
        content: "I am unable to locate your settings.",
      });
      return;
    }

    const pageBack = new MessageButton()
      .setCustomId("prev")
      .setDisabled(true)
      .setLabel("◀")
      .setStyle("PRIMARY");
    const pageForward = new MessageButton()
      .setCustomId("next")
      .setLabel("▶")
      .setStyle("PRIMARY");
    lastPage = parseInt(
      embed?.footer?.text?.split(" ").reverse()[0] || "haha",
      10
    );
    if (lastPage === 1) {
      pageForward.setDisabled(true);
    }

    const sent = (await interaction.editReply({
      embeds: [embed],
      components: [new MessageActionRow().addComponents(pageBack, pageForward)],
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
        config,
        setting as ArraySettings,
        page
      );

      if (!embed) {
        await interaction.editReply({
          content: "I am unable to locate your settings.",
        });
        return;
      }

      await interaction.editReply({
        embeds: [embed],
        components: [
          new MessageActionRow().addComponents(pageBack, pageForward),
        ],
      });
    });

    buttonCollector.on("end", async () => {
      pageBack.setDisabled(true);
      pageForward.setDisabled(true);
      await interaction.editReply({
        components: [
          new MessageActionRow().addComponents(pageBack, pageForward),
        ],
      });
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "automod view command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "automod view", errorId)],
        ephemeral: true,
      })
      .catch(
        async () =>
          await interaction.editReply({
            embeds: [errorEmbedGenerator(Becca, "automod view", errorId)],
          })
      );
  }
};
