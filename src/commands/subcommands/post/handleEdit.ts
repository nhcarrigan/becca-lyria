/* eslint-disable jsdoc/require-param */
import {
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  ActionRowBuilder,
  PermissionFlagsBits,
} from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Creates a Modal for text input for the content of post to be updated by the bot.
 */
export const handleEdit: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { member, guild } = interaction;

    if (!guild) {
      await interaction.reply({
        content: getRandomValue(t("responses:missingGuild")),
      });
      return;
    }

    const link = interaction.options.getString("link", true).split("/");
    const channelId = link[link.length - 2];
    const messageId = link[link.length - 1];

    const channel = guild.channels.resolve(channelId);

    if (
      !member ||
      typeof member.permissions === "string" ||
      !member.permissions.has(PermissionFlagsBits.ManageGuild)
    ) {
      await interaction.reply({
        content: getRandomValue(t("responses:noPermission")),
      });
      return;
    }
    if (!channel || !("messages" in channel)) {
      await interaction.reply({
        content: "unknown channel",
      });
      return;
    }

    const targetMessage = await channel.messages.fetch(messageId);

    if (targetMessage.author !== Becca.user) {
      await interaction.reply({
        content: "I can't edit that message as it wasn't posted by me.",
      });
      return;
    }

    const editModal = new ModalBuilder()
      .setCustomId(`pe-${channelId}-${messageId}`)
      .setTitle("post edit");
    const contentInput = new TextInputBuilder()
      .setCustomId("content-input")
      .setLabel("Enter the updated text for the post: ")
      .setStyle(TextInputStyle.Paragraph)
      .setValue(targetMessage.content)
      .setMaxLength(4000)
      .setRequired(true);
    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
      contentInput
    );
    editModal.addComponents(row);
    await interaction.showModal(editModal);
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "post command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.reply({
      embeds: [errorEmbedGenerator(Becca, "edit", errorId, t)],
    });
  }
};
