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
 * Creates a Modal for text input for the content of posts created by the bot.
 */
export const handleCreate: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { member } = interaction;

    if (
      !member ||
      typeof member.permissions === "string" ||
      !member.permissions.has(PermissionFlagsBits.ManageGuild)
    ) {
      await interaction.editReply({
        content: getRandomValue(t("responses:noPermission")),
      });
      return;
    }

    const channel = interaction.options.getChannel("channel", true);
    const contentModal = new ModalBuilder()
      .setCustomId(`pc-${channel.id}`)
      .setTitle("post create");
    const contentInput = new TextInputBuilder()
      .setCustomId("content-input")
      .setLabel("Enter the text you want to send in the post: ")
      .setStyle(TextInputStyle.Paragraph)
      .setMaxLength(4000)
      .setRequired(true);
    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
      contentInput
    );
    contentModal.addComponents(row);
    await interaction.showModal(contentModal);
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "post command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "create", errorId, t)],
    });
  }
};
