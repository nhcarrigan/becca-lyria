/* eslint-disable jsdoc/require-param */

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Handles removing a role from an existing reaction role post.
 */
export const handleRemove: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { guild } = interaction;

    if (!guild) {
      await interaction.editReply({ content: t("responses:missingGuild") });
      return;
    }

    const role = interaction.options.getRole("role", true);
    const [messageId, channelId] = interaction.options
      .getString("link", true)
      .split("/")
      .reverse();

    if (!messageId || !channelId) {
      await interaction.editReply({
        content: t("commands:reactionrole.remove.badLink"),
      });
      return;
    }

    const channel =
      guild.channels.cache.get(channelId) ||
      (await guild.channels.fetch(channelId));

    if (!channel || !("messages" in channel)) {
      await interaction.editReply({
        content: t("commands:reactionrole.remove.badChannel"),
      });
      return;
    }

    const message = await channel.messages.fetch(messageId);

    if (!message) {
      await interaction.editReply({
        content: t("commands:reactionrole.remove.badMessage"),
      });
      return;
    }

    if (message.author.id !== Becca.user?.id) {
      await interaction.editReply({
        content: t("commands:reactionrole.remove.notMine"),
      });
      return;
    }

    if (!message.components.length) {
      await interaction.editReply({
        content: t("commands:reactionrole.remove.notReactionRole"),
      });
      return;
    }

    const rowHasRole = message.components.find((row) =>
      row.components.find((button) => button.customId === `rr-${role.id}`)
    );

    if (!rowHasRole) {
      await interaction.editReply({
        content: t("commands:reactionrole.remove.noRole"),
      });
      return;
    }

    const index = rowHasRole.components.findIndex(
      (button) => button.customId === `rr-${role.id}`
    );

    rowHasRole.spliceComponents(index, 1);

    await message.edit({ components: message.components });

    await interaction.editReply({
      content: t("commands:reactionrole.remove.success"),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "reaction role create",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "reactionrole create", errorId, t)],
    });
  }
};
