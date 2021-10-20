/* eslint-disable jsdoc/require-param */

import { ListenerHandler } from "../../../interfaces/listeners/ListenerHandler";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Submodule for amirite comebacks.
 */
export const sassAmirite: ListenerHandler = async (Becca, message) => {
  try {
    const { channel, content } = message;

    const amiriteRegex =
      /(am|was)\s?i\sright\??|(i\sam|i'm|i\swas)\s?right|amirite/i;

    if (amiriteRegex.test(content)) {
      await channel.send(Becca.sass.amirite);
    }
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "amirite sassListener",
      err,
      message.guild?.name,
      message
    );
  }
};
