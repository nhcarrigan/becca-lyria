/* eslint-disable jsdoc/require-param */
import { PermissionFlagsBits } from "discord.js";
import { DefaultTFuncReturn } from "i18next";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Creates a Modal for text input for the content of post to be updated by the bot.
 */
export const handleDelete: CommandHandler = async (Becca, interaction, t) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const { member, guild } = interaction;

    if (!guild) {
      await interaction.editReply({
        content: getRandomValue(
          t<string, DefaultTFuncReturn & string[]>("responses:missingGuild")
        ),
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
      await interaction.editReply({
        content: getRandomValue(
          t<string, DefaultTFuncReturn & string[]>("responses:noPermission")
        ),
      });
      return;
    }
    if (!channel || !("messages" in channel)) {
      await interaction.reply({
        content: t("commands:post.delete.invalid"),
      });
      return;
    }

    const targetMessage = await channel.messages
      .fetch(messageId)
      .catch(() => null);

    if (!targetMessage) {
      await interaction.editReply({
        content: t("commands:post.delete.doesnt-exist"),
      });
      return;
    }

    if (targetMessage.author !== Becca.user || !targetMessage.deletable) {
      await interaction.editReply({
        content: t("commands:post.delete.cant-delete"),
      });
      return;
    }
    await targetMessage.delete();
    await interaction.reply({
      content: t("commands:post.delete.success"),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "post delete command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.reply({
      embeds: [errorEmbedGenerator(Becca, "delete", errorId, t)],
    });
  }
};
