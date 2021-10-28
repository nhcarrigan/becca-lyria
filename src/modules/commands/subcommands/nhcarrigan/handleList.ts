/* eslint-disable jsdoc/require-param */
import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Generates a paginated embed containing the list of servers Becca is currently in.
 * TODO: Remove this when Becca is verified.
 */
export const handleList: CommandHandler = async (Becca, interaction) => {
  try {
    const serverList = Becca.guilds.cache.map((el) => el);
    const ownerIds: string[] = [];
    const serverTexts: string[] = [];

    for (const server of serverList) {
      const owner = await server.members.fetch(server.ownerId);
      serverTexts.push(
        `${server.name} (${server.id}) owned by ${owner.user.username} (${owner.id})`
      );
      ownerIds.push(owner.id);
    }

    let page = 1;
    const lastPage = Math.ceil(serverTexts.length / 10);

    const pageData = serverTexts.slice(page * 10 - 10, page * 10);

    const embed = new MessageEmbed();
    embed.setTitle(`Becca's Guild List`);
    embed.setFooter(`Page ${page} of ${lastPage}`);
    embed.setColor(Becca.colours.default);
    embed.setDescription(pageData.join("\n"));
    embed.addField("Total servers", serverTexts.length.toString(), true);
    embed.addField("Unique Owners", new Set(ownerIds).size.toString(), true);

    const pageBack = new MessageButton()
      .setCustomId("prev")
      .setDisabled(true)
      .setLabel("◀")
      .setStyle("PRIMARY");
    const pageForward = new MessageButton()
      .setCustomId("next")
      .setLabel("▶")
      .setStyle("PRIMARY");

    if (lastPage === 1) {
      pageForward.setDisabled(true);
    }

    const sent = (await interaction.editReply({
      embeds: [embed],
      components: [new MessageActionRow().addComponents(pageBack, pageForward)],
    })) as Message;

    const clickyClick = sent.createMessageComponentCollector({
      time: 30000,
      filter: (click) => click.user.id === interaction.user.id,
    });

    clickyClick.on("collect", async (click) => {
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
        serverTexts.slice(page * 10 - 10, page * 10).join("\n")
      );
      embed.setFooter(`Page ${page} of ${lastPage}`);

      await interaction.editReply({
        embeds: [embed],
        components: [
          new MessageActionRow().addComponents(pageBack, pageForward),
        ],
      });
    });

    clickyClick.on("end", async () => {
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
      "list command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "list", errorId)],
    });
  }
};
