/* eslint-disable jsdoc/require-jsdoc */
import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
  User,
} from "discord.js";

import { Context } from "../interfaces/contexts/Context";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const bookmark: Context = {
  data: {
    name: "bookmark",
    type: 3,
  },
  run: async (Becca, interaction, t): Promise<void> => {
    try {
      await interaction.deferReply({ ephemeral: true });

      const message = interaction.options.getMessage("message") as Message;
      const channel = interaction.channel as TextChannel;
      const guild = interaction.guild?.name;

      if (!message || !channel || !guild) {
        await interaction.editReply(t("contexts:bookmark.failed"));
        return;
      }

      const author = message.author as User;

      const bookmarkEmbed = new MessageEmbed();
      bookmarkEmbed.setTitle(t("contexts:bookmark.title"));
      bookmarkEmbed.setDescription(message.url);
      bookmarkEmbed.setAuthor({
        name: author.tag,
        iconURL: author.displayAvatarURL(),
      });
      bookmarkEmbed.setColor(Becca.colours.default);
      bookmarkEmbed.addField("Guild", guild, true);
      bookmarkEmbed.addField("Channel", channel.name, true);
      bookmarkEmbed.setFooter({
        text: t("defaults:donate"),
        iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
      });

      const deleteButton = new MessageButton()
        .setCustomId("delete-bookmark")
        .setLabel(t("contexts:bookmark.deleteLabel"))
        .setStyle("DANGER");

      const row = new MessageActionRow().addComponents([deleteButton]);

      await interaction.user
        .send({ embeds: [bookmarkEmbed], components: [row] })
        .then(async () => {
          await interaction.editReply(t("contexts:bookmark.success"));
        })
        .catch(async () => {
          await interaction.editReply(t("contexts:bookmark.noDm"));
        });
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "bookmark context command",
        err,
        interaction.guild?.name
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "bookmark context", errorId)],
      });
    }
  },
};
