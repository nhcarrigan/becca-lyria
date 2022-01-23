/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { topicList } from "../../../../config/commands/topicList";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Generates an embed containing a random conversation starter from the topicList.
 */
export const handleTopic: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { user } = interaction;

    const topicArray = topicList.split("\n");

    const randomIndex = Math.floor(Math.random() * topicArray.length);

    const randomTopic = topicArray[randomIndex];

    const topicEmbed = new MessageEmbed();
    topicEmbed.setTitle(t("commands:community.topic.title"));
    topicEmbed.setDescription(randomTopic);
    topicEmbed.setColor(Becca.colours.default);
    topicEmbed.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() });
    topicEmbed.setFooter({ text: t("commands:community.topic.footer") });

    await interaction.editReply({ embeds: [topicEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "topic command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "topic", errorId)],
    });
  }
};
