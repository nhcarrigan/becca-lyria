import { Message } from "discord.js";
import mee6 from "mee6-levels-api";

import levelScale from "../../config/listeners/levelScale";
import LevelModel from "../../database/models/LevelModel";
import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Owner command for migrating Mee6 levels to Becca's system.
 *
 * @param {BeccaLyria} Becca Becca's discord instance.
 * @param {Message} message The message payload from Discord.
 */
export const naomiMee6 = async (Becca: BeccaLyria, message: Message) => {
  try {
    // Naomi fish <link>
    const [, , serverId] = message.content.split(" ");

    const targetGuild = await Becca.guilds.fetch(serverId);

    if (!targetGuild) {
      await message.reply(`Guild ${serverId} not found.`);
      return;
    }

    const leaderboard = await mee6.getLeaderboard(serverId);
    const len = leaderboard.length;

    await message.reply(`Got ${len} users!`);

    for (let i = 0; i < len; i++) {
      if (i % 100 === 0) {
        await message.reply(`Loaded ${i} users out of ${len}!`);
      }
      const user = leaderboard[i];
      await LevelModel.create({
        serverID: serverId,
        serverName: targetGuild.name,
        userID: user.id,
        userTag: `${user.username}#${user.discriminator}`,
        avatar: user.avatarUrl,
        points: user.level <= 100 ? levelScale[user.level] : 505000,
        level: user.level <= 100 ? user.level : 100,
        lastSeen: new Date(),
        cooldown: 0,
      });
    }

    await message.reply("Migration complete! Kick that shit bot.");
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "naomi antiphish",
      err,
      message.guild?.name,
      message
    );
  }
};
