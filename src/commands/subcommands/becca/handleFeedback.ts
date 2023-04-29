import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
} from "@discordjs/builders";
import { TextInputStyle } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Handles the feedback command, building a modal and sending it to the user for a response.
 */
export const handleFeedback: CommandHandler = async (Becca, interaction, t) => {
  try {
    const feedbackModal = new ModalBuilder()
      .setCustomId("feedback-modal")
      .setTitle("Becca Lyria Feedback!");
    const feedbackInput = new TextInputBuilder()
      .setCustomId("feedback")
      .setLabel("Share your feedback. Will be public!")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const actionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        feedbackInput
      );
    feedbackModal.addComponents(actionRow);
    await interaction.showModal(feedbackModal);
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "feedback command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "feedback", errorId, t)],
    });
  }
};
