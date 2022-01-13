import { TextChannel } from "discord.js";

import ReactionRoleModel from "../database/models/ReactionRoleModel";
import { BeccaLyria } from "../interfaces/BeccaLyria";

import { beccaErrorHandler } from "./beccaErrorHandler";

/**
 * Iterates through the reaction role data, fetching anything that isn't already cached.
 * Otherwise we don't seem to get the reaction event.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 */
export const cacheReactionRoles = async (Becca: BeccaLyria): Promise<void> => {
  try {
    const roleList = await ReactionRoleModel.find({});

    for (const reactionRole of roleList) {
      const guild =
        Becca.guilds.cache.find((el) => el.id === reactionRole.serverId) ||
        (await Becca.guilds.fetch(reactionRole.serverId));
      if (!guild) {
        continue;
      }
      const channel =
        guild.channels.cache.find((el) => el.id === reactionRole.channelId) ||
        (await guild.channels.fetch(reactionRole.channelId));
      if (!channel) {
        continue;
      }
      const message = await (channel as TextChannel).messages.fetch(
        reactionRole.messageId
      );
      if (!message) {
        continue;
      }
      console.log(
        `Cached message ${message.id} in ${channel.name} of ${guild.name}`
      );
    }
  } catch (err) {
    await beccaErrorHandler(Becca, "reaction role caching", err);
  }
};
