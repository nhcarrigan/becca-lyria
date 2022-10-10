import { ModalSubmitInteraction, PermissionFlagsBits } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Handles the submit event for the content input modal.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {ModalSubmitInteraction} interaction The interaction payload from Discord.
 * @param {TFunction} t Our tranlsation function.
 */
export const handleEditModal = async (
  Becca: BeccaLyria,
  interaction: ModalSubmitInteraction,
  t: TFunction
) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const { guild } = interaction;

    if (!guild || !guild.members.me) {
      await interaction.editReply({
        content: getRandomValue(t("responses:missingGuild")),
      });
      return;
    }

    const targetChannelId = interaction.customId.split("-")[1];
    const targetMessageId = interaction.customId.split("-")[2];
    const targetChannel = guild.channels.resolve(targetChannelId);

    if (
      !targetChannel ||
      !("messages" in targetChannel) ||
      !targetChannel
        .permissionsFor(guild.members.me)
        .has([
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
        ])
    ) {
      await interaction.editReply(
        t("commands:post.edit.failure", {
          link: `<https://discord.com/channels/${guild.id}/${targetChannelId}/${targetMessageId}>`,
        })
      );
      return;
    }

    const targetMessage = await targetChannel.messages.fetch(targetMessageId);
    const contentInput = interaction.fields.getTextInputValue("content-input");

    await targetMessage.edit({
      content: contentInput,
    });
    await interaction.editReply({
      content: t("commands:post.edit.success", {
        link: `<https://discord.com/channels/${guild.id}/${targetChannelId}/${targetMessageId}>`,
      }),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "post edit command",
      err,
      interaction.guild?.name
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "post edit modal", errorId, t)],
    });
  }
};
