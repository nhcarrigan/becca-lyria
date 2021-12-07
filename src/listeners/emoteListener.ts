/* eslint-disable jsdoc/require-jsdoc */
import { Listener } from "../interfaces/listeners/Listener";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const emoteListener: Listener = {
  name: "emoteListener",
  description: "Handles the logic for emote-only channels.",
  run: async (Becca, message, config) => {
    try {
      if (!config.emote_channels?.includes(message.channel.id)) {
        return;
      }

      if (!message.content) {
        await message.delete();
        return;
      }

      const newContent = message.content
        ?.replace(/:[^:\s]+:|<:[^:\s]+:[0-9]+>|<a:[^:\s]+:[0-9]+>/g, "")
        .replace(/\s/g, "");

      console.table({ newContent });

      if (newContent?.length) {
        await message.delete();
        return;
      }
    } catch (err) {
      await beccaErrorHandler(
        Becca,
        "trigger listener",
        err,
        message.guild?.name,
        message
      );
    }
  },
};
