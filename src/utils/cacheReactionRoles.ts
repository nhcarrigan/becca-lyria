import { TextChannel } from "discord.js";

import ReactionRoleModel from "../database/models/ReactionRoleModel";
import { BeccaLyria } from "../interfaces/BeccaLyria";

import { beccaErrorHandler } from "./beccaErrorHandler";
import { beccaLogHandler } from "./beccaLogHandler";

/**
 * Iterates through the reaction role data, fetching anything that isn't already cached.
 * Otherwise we don't seem to get the reaction event.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 */
export const cacheReactionRoles = async (Becca: BeccaLyria): Promise<void> => {
  try {
    const roleList = await ReactionRoleModel.find({});
    const cacheMap = new Set();

    for (const reactionRole of roleList) {
      const { messageId, channelId, serverId } = reactionRole;
      if (cacheMap.has(`${serverId}/${channelId}/${messageId}`)) {
        continue;
      }
      const guild =
        Becca.guilds.cache.find((el) => el.id === serverId) ||
        (await Becca.guilds.fetch(serverId));
      if (!guild) {
        continue;
      }
      const channel =
        guild.channels.cache.find((el) => el.id === channelId) ||
        (await guild.channels.fetch(channelId));
      if (!channel) {
        continue;
      }
      const message = await (channel as TextChannel).messages.fetch(messageId);
      cacheMap.add(`${serverId}/${channelId}/${messageId}`);
      if (!message) {
        continue;
      }
      beccaLogHandler.log(
        "info",
        `Cached message ${message.id} in ${channel.name} of ${guild.name}`
      );
    }
  } catch (err) {
    await beccaErrorHandler(Becca, "reaction role caching", err);
  }
};
