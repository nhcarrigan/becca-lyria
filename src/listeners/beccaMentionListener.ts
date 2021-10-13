/* eslint-disable jsdoc/require-jsdoc */
import { Listener } from "../interfaces/listeners/Listener";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

/**
 * Listens for messages that mention Becca. Responds to those
 * messages with instructions for using the new commands.
 */
export const beccaMentionListener: Listener = {
  name: "Becca Mention Listener",
  description: "Listens for Becca being mentioned.",
  run: async (Becca, message) => {
    try {
      const { channel, guild, mentions } = message;
      if (!guild || !Becca.user || !mentions.users?.has(Becca.user.id)) {
        return;
      }

      await message.react(Becca.configs.think);
      await channel.send(
        "What can I do for you? Cast `/becca help` to see my spells!"
      );
    } catch (err) {
      await beccaErrorHandler(
        Becca,
        "mention listener",
        err,
        message.guild?.name,
        message
      );
    }
  },
};
