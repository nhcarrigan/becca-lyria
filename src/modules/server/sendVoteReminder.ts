import { WebhookPayload } from "@top-gg/sdk";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { Voter } from "../../interfaces/database/Voter";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * A module to send a vote reminder message to a given channel.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {WebhookPayload} payload The vote payload from Top.gg.
 * @param {Voter} voter The user's database record.
 * @param {string} type The type of vote - either "bot" or "server".
 */
export const sendVoteReminder = async (
  Becca: BeccaLyria,
  payload: WebhookPayload,
  voter: Voter,
  type: "bot" | "server" | "unknown"
): Promise<void> => {
  try {
    if (type === "unknown") {
      return;
    }
    const guild = await Becca.guilds.fetch(Becca.configs.homeGuild);
    const channel = await guild.channels.fetch(Becca.configs.voteChannel);

    if (channel?.type !== "GUILD_TEXT") {
      return;
    }

    const message = `Hey <@!${
      payload.user
    }>! It's time to vote for the ${type} on top.gg again!\n\nYou can vote here: ${
      type === "server"
        ? "https://top.gg/servers/778130114772598785/vote"
        : "Bot vote coming soon!"
    }`;

    await channel.send({ content: message });
  } catch (err) {
    await beccaErrorHandler(Becca, "send vote message", err);
  }
};
