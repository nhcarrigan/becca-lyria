import {
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";

import ReactionRoleModel from "../../database/models/ReactionRoleModel";
import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Handles the messageReactionAdd event. Checks for a related reaction role and applies it.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {MessageReaction | PartialMessageReaction} reaction The reaction payload from Discord.
 * @param {User | PartialUser} user The user that added the reaction.
 */
export const reactionAdd = async (
  Becca: BeccaLyria,
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
) => {
  try {
    if (user.bot || !reaction.message.guildId || !reaction.message.channelId) {
      return;
    }

    const { id: messageId, guildId: serverId, channelId } = reaction.message;

    const emojiValue = reaction.emoji.id
      ? `<:${reaction.emoji.name}:${reaction.emoji.id}>`
      : reaction.emoji.name;

    if (!emojiValue) {
      return;
    }

    const hasReactionRole = await ReactionRoleModel.findOne({
      serverId,
      messageId,
      channelId,
      emoji: emojiValue,
    });

    if (!hasReactionRole) {
      return;
    }

    const member =
      reaction.message.guild?.members.cache.find((el) => el.id === user.id) ||
      (await reaction.message.guild?.members.fetch(user.id));
    const role =
      reaction.message.guild?.roles.cache.find(
        (el) => el.id === hasReactionRole.roleId
      ) || (await reaction.message.guild?.roles.fetch(hasReactionRole.roleId));
    if (!member || !role) {
      return;
    }

    await member.roles.add(role);
  } catch (err) {
    await beccaErrorHandler(Becca, "reaction remove event", err);
  }
};
