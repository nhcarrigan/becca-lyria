/* eslint-disable jsdoc/require-param */
import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Role,
} from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { sleep } from "../../../../utils/sleep";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * If the `role` parameter is passed, and if the value is a self-assignable role as
 * defined in the server's config, will assign or remove the role for the user.
 * If the `role` is not passed, generates a paginated embed listing the roles that can be
 * self-assigned.
 */
export const handleRole: CommandHandler = async (
  Becca,
  interaction,
  config
): Promise<void> => {
  try {
    const { guild, member } = interaction;

    if (!guild || !member) {
      await interaction.editReply({
        content: getRandomValue(Becca.responses.missingGuild),
      });
      return;
    }

    const targetRole = interaction.options.getRole("role");

    if (!targetRole) {
      if (!config.self_roles.length) {
        await interaction.editReply({
          content: "Your guild does not have any self-assignable titles.",
        });
        return;
      }
      let page = 1;
      const roleList = config.self_roles.map((role) => `<@&${role}>`);
      const lastPage = Math.ceil(roleList.length / 10);

      const embed = new MessageEmbed();
      embed.setTitle("Here are the titles I can grant you!");
      embed.setDescription(
        roleList.slice(page * 10 - 10, page * 10).join("\n")
      );
      embed.setFooter(`Page ${page} of ${lastPage}`);

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
        components: [
          new MessageActionRow().addComponents(pageBack, pageForward),
        ],
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
          roleList.slice(page * 10 - 10, page * 10).join("\n")
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

      await sleep(35000);
      return;
    }

    if (!config.self_roles.includes(targetRole.id)) {
      await interaction.editReply({
        content:
          "I cannot cast that enchantment. You will need to speak to someone higher up.",
      });
      return;
    }

    if (Array.isArray(member.roles)) {
      await interaction.editReply({
        content: "Something is wrong with your role data...",
      });
      return;
    }

    if (member.roles.cache.has(targetRole.id)) {
      await member.roles.remove(targetRole as Role);
      await interaction.editReply({
        content: `You are no longer enchanted with \`${targetRole.name}\`.`,
      });
      return;
    }
    await member.roles.add(targetRole as Role);
    await interaction.editReply({
      content: `I have cast the \`${targetRole.name}\` charm on you.`,
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "role command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "role", errorId)],
    });
  }
};
