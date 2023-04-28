import { voters } from "@prisma/client";
import { WebhookPayload } from "@top-gg/sdk";
import { ChannelType } from "discord.js";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * A module to send a vote confirmation message to the provided channel.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {WebhookPayload} payload The vote payload from Top.gg.
 * @param {voters} voter The user's database record.
 * @param {string} type The type of vote - either "bot" or "server".
 */
export const sendVoteMessage = async (
  Becca: BeccaLyria,
  payload: WebhookPayload,
  voter: voters,
  type: "bot" | "server" | "unknown"
): Promise<void> => {
  try {
    if (type === "unknown") {
      return;
    }
    const guild = await Becca.guilds.fetch(Becca.configs.homeGuild);
    const channel = await guild.channels.fetch(Becca.configs.voteChannel);

    if (channel?.type !== ChannelType.GuildText) {
      return;
    }

    const message = `Hey <@!${
      payload.user
    }>! Thanks for voting for the ${type} on top.gg! Remember to vote again in 12 hours!\n\nYou have voted ${
      type === "bot" ? voter.botVotes : voter.serverVotes
    } times! This month, you have voted ${
      voter.monthlyVotes
    } out of 60 times to claim your reward!`;

    await channel.send({ content: message });
  } catch (err) {
    await beccaErrorHandler(Becca, "send vote message", err);
  }
};
