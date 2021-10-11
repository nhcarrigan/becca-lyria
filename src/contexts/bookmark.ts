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
import { customSubstring } from "../utils/customSubstring";

export const bookmark: Context = {
  data: {
    name: "bookmark",
    type: 3,
  },
  run: async (Becca, interaction): Promise<void> => {
    try {
      await interaction.deferReply({ ephemeral: true });

      const message = interaction.options.getMessage("message") as Message;
      const channel = interaction.channel as TextChannel;
      const guild = interaction.guild?.name;

      if (!message || !channel || !guild) {
        await interaction.editReply(
          "I cannot bookmark that for you as I cannot locate the necessary records."
        );
        return;
      }

      const author = message.author as User;

      const bookmarkEmbed = new MessageEmbed();
      bookmarkEmbed.setTitle(`Your saved message!`);
      bookmarkEmbed.setDescription(
        `${customSubstring(message.content || "no content found!", 4000)}`
      );
      bookmarkEmbed.setAuthor(author.tag, author.displayAvatarURL());
      bookmarkEmbed.setColor(Becca.colours.default);
      bookmarkEmbed.addField("Guild", guild, true);
      bookmarkEmbed.addField("Channel", channel.name, true);
      bookmarkEmbed.addField("Link", message.url);

      const deleteButton = new MessageButton()
        .setCustomId("delete-bookmark")
        .setLabel("Delete this bookmark.")
        .setStyle("DANGER");

      const row = new MessageActionRow().addComponents([deleteButton]);

      await interaction.user
        .send({ embeds: [bookmarkEmbed], components: [row] })
        .then(
          async () =>
            await interaction.editReply(
              "I have bookmarked that message for you."
            )
        )
        .catch(
          async () =>
            await interaction.editReply(
              "I could not bookmark that for you. Please ensure your private messages are open."
            )
        );
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "bookmark context command",
        err,
        interaction.guild?.name
      );
      await interaction
        .reply({
          embeds: [errorEmbedGenerator(Becca, "bookmark context", errorId)],
          ephemeral: true,
        })
        .catch(
          async () =>
            await interaction.editReply({
              embeds: [errorEmbedGenerator(Becca, "bookmark context", errorId)],
            })
        );
    }
  },
};
