/* eslint-disable jsdoc/require-param */
import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";

import levelScale from "../../../../config/listeners/levelScale";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

const formatLevels = (page: number) => {
  let formattedText = "";
  for (let i = page * 10 - 9; i <= page * 10; i++) {
    formattedText += `\nLevel ${i} - **${levelScale[i]}** xp`;
  }
  return formattedText;
};

/**
 * Generates a paginated embed containing the level scale.
 */
export const handleLevelscale: CommandHandler = async (Becca, interaction) => {
  try {
    const embed = new MessageEmbed();
    embed.setTitle("Level Scale");
    embed.setURL(
      "https://www.beccalyria.com/discord-documentation/#/level-scale"
    );
    embed.setDescription(
      `This is the breakdown of experience points needed for Becca's levelling system.\n${formatLevels(
        1
      )}`
    );
    embed.setColor(Becca.colours.default);
    embed.setTimestamp();

    let page = 1;
    const lastPage = Math.ceil((Object.keys(levelScale).length - 1) / 10);

    const pageBack = new MessageButton()
      .setCustomId("prev")
      .setDisabled(true)
      .setLabel("◀")
      .setStyle("PRIMARY");

    const pageForward = new MessageButton()
      .setCustomId("next")
      .setLabel("▶")
      .setStyle("PRIMARY");

    const sent = (await interaction.editReply({
      embeds: [embed],
      components: [new MessageActionRow().addComponents(pageBack, pageForward)],
    })) as Message;

    const componentCollector = sent.createMessageComponentCollector({
      time: 30000,
      filter: (click) => click.user.id === interaction.user.id,
    });

    componentCollector.on("collect", async (click) => {
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

      embed.setDescription(
        `This is the breakdown of experience points needed for Becca's levelling system.\n${formatLevels(
          page
        )}`
      );
      embed.setFooter(`Page ${page} of ${lastPage}`);

      await interaction.editReply({
        embeds: [embed],
        components: [
          new MessageActionRow().addComponents(pageBack, pageForward),
        ],
      });
    });

    componentCollector.on("end", async () => {
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
      "levelscale command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "levelscale", errorId)],
    });
  }
};
