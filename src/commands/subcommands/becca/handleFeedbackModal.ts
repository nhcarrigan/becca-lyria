import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Handles the submit event for the feedback modal.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {ModalSubmitInteraction} interaction The interaction payload from Discord.
 * @param {TFunction} t Our tranlsation function.
 */
export const handleFeedbackModal = async (
  Becca: BeccaLyria,
  interaction: ModalSubmitInteraction,
  t: TFunction
) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const { guild, user } = interaction;
    const feedback = interaction.fields.getTextInputValue("feedback");

    if (!guild) {
      await interaction.editReply({
        content: getRandomValue(t<string, string[]>("responses:missingGuild")),
      });
      return;
    }

    const feedbackEmbed = new EmbedBuilder();
    feedbackEmbed.setTitle("Feedback Received!");
    feedbackEmbed.setDescription(customSubstring(feedback, 4000));
    feedbackEmbed.setColor(Becca.colours.default);
    feedbackEmbed.addFields([
      {
        name: "Guild",
        value: guild.name,
      },
    ]);
    feedbackEmbed.setAuthor({
      name: user.tag,
      iconURL: user.displayAvatarURL(),
    });
    feedbackEmbed.setFooter({
      text: t<string, string>("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await Becca.feedbackHook.send({ embeds: [feedbackEmbed] });

    await interaction.editReply({
      content: t<string, string>("commands:becca.feedback.success"),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "feedback modal command",
      err,
      interaction.guild?.name
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "feedback modal", errorId, t)],
    });
  }
};
