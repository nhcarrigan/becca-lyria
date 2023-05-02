import { EmbedBuilder } from "discord.js";

import { ModalHandler } from "../../../interfaces/modals/ModalHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";

export const handleFeedbackModal: ModalHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const { guild, user } = interaction;
    const feedback = interaction.fields.getTextInputValue("feedback");
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
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await Becca.feedbackHook.send({ embeds: [feedbackEmbed] });

    await interaction.editReply({
      content: t("commands:becca.feedback.success"),
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
