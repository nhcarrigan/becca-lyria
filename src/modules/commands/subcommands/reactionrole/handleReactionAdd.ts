/* eslint-disable jsdoc/require-param */
import { Guild, MessageEmbed, TextBasedChannel } from "discord.js";

import ReactionRoleModel from "../../../../database/models/ReactionRoleModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Adds a reaction role to the provided message.
 */
export const handleReactionAdd: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const guild = interaction.guild as Guild;
    const messageLink = interaction.options.getString("message", true);
    const [messageId, channelId, serverId] = messageLink.split("/").reverse();
    const targetChannel = guild.channels.cache.get(
      channelId
    ) as TextBasedChannel;
    const targetMessage = await targetChannel?.messages.fetch(messageId);

    if (!targetMessage) {
      await interaction.editReply(t("commands:reactionrole.add.message"));
      return;
    }

    const emoji = interaction.options.getString("emoji", true);

    const reacted = await targetMessage
      .react(emoji)
      .then((data) => data)
      .catch(() => null);
    if (!reacted) {
      await interaction.editReply(t("commands:reactionrole.add.invalid"));
      return;
    }

    const emojiValue = reacted.emoji.id
      ? `<:${reacted.emoji.name}:${reacted.emoji.id}>`
      : reacted.emoji.name;

    if (!emojiValue) {
      await interaction.editReply(t("commands:reactionrole.add.parse"));
      return;
    }

    const role = interaction.options.getRole("role", true);
    const reactionRole =
      (await ReactionRoleModel.findOne({
        serverId,
        channelId,
        messageId,
        emoji: emojiValue,
      })) ||
      (await ReactionRoleModel.create({
        serverId,
        channelId,
        messageId,
        emoji: emojiValue,
        roleId: role.id,
      }));

    reactionRole.roleId = role.id;
    await reactionRole.save();

    const addEmbed = new MessageEmbed();
    addEmbed.setTitle(t("commands:reactionrole.add.title"));
    addEmbed.setColor(Becca.colours.default);
    addEmbed.setDescription(
      t("commands:reactionrole.add.description", {
        emote: emojiValue,
        role: `<@&${role.id}>`,
      })
    );
    addEmbed.addField(t("commands:reactionrole.add.link"), messageLink);
    addEmbed.setTimestamp();
    addEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent",
    });

    await interaction.editReply({ embeds: [addEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "handleReactionAdd command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "handleReactionAdd", errorId, t)],
    });
  }
};
