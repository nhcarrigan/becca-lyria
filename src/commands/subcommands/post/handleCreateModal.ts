import { ModalSubmitInteraction, PermissionFlagsBits } from "discord.js";
import { DefaultTFuncReturn, TFunction } from "i18next";

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
export const handleCreateModal = async (
  Becca: BeccaLyria,
  interaction: ModalSubmitInteraction,
  t: TFunction
) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const { guild } = interaction;

    if (!guild || !guild.members.me) {
      await interaction.editReply({
        content: getRandomValue(
          t<string, DefaultTFuncReturn & string[]>("responses:missingGuild")
        ),
      });
      return;
    }

    const targetChannelId = interaction.customId.split("-")[1];
    const targetChannel = guild.channels.resolve(targetChannelId);

    if (!targetChannel || !targetChannel.isTextBased()) {
      await interaction.editReply(
        t("commands:post.create.nonTextChannel", {
          channelId: targetChannelId,
        })
      );
      return;
    }

    if (
      !targetChannel
        .permissionsFor(guild.members.me)
        .has([
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
        ])
    ) {
      await interaction.editReply(
        t("commands:post.create.noPerms", {
          channelId: targetChannelId,
        })
      );
      return;
    }
    const contentInput = interaction.fields.getTextInputValue("content-input");

    await targetChannel.send({ content: contentInput });
    await interaction.editReply({
      content: t("commands:post.create.success", {
        channelId: targetChannelId,
      }),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "post create command",
      err,
      interaction.guild?.name
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "post create modal", errorId, t)],
    });
  }
};
