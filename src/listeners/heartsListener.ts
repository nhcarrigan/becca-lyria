/* eslint-disable jsdoc/require-jsdoc */
import { defaultHearts } from "../config/listeners/defaultHearts";
import { Listener } from "../interfaces/listeners/Listener";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

/**
 * Checks the server settings to see if the user that sent the message
 * is configured to receive a heart reaction. If so, reacts.
 *
 * Also validates against the defaultHearts config.
 */
export const heartsListener: Listener = {
  name: "Hearts Listener",
  description: "Adds heart reactions to specified users.",
  run: async (Becca, message, config) => {
    try {
      const { author } = message;
      const usersToHeart = defaultHearts.concat(config.hearts);
      if (usersToHeart.includes(author.id)) {
        await message.react(Becca.configs.love);
      }
    } catch (err) {
      await beccaErrorHandler(
        Becca,
        "hearts listener",
        err,
        message.guild?.name,
        message
      );
    }
  },
};
