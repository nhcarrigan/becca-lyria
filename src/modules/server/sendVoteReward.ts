import { voters } from "@prisma/client";
import { ChannelType } from "discord.js";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * A module to send a notification to the provided channel to let the user know
 * they have qualified for the vote reward.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {voters} voter The user's database record.
 */
export const sendVoteReward = async (
  Becca: BeccaLyria,
  voter: voters
): Promise<void> => {
  try {
    const guild = await Becca.guilds.fetch(Becca.configs.homeGuild);
    const channel = await guild.channels.fetch(Becca.configs.voteChannel);

    if (channel?.type !== ChannelType.GuildText) {
      return;
    }

    const message = `Hey <@!${voter.userId}>! You voted for our bot or server ${voter.monthlyVotes} times last month! You qualify for the Voter role! <@!${Becca.configs.ownerId}> will give you the role as soon as she's available!`;

    await channel.send({ content: message });
  } catch (err) {
    await beccaErrorHandler(Becca, "send vote message", err);
  }
};
