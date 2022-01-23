/* eslint-disable jsdoc/require-param */

import { ListenerHandler } from "../../../interfaces/listeners/ListenerHandler";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Submodule for amirite comebacks.
 */
export const sassAmirite: ListenerHandler = async (Becca, message, t) => {
  try {
    const { channel, content } = message;

    const amiriteRegex =
      /(am|was)\s?i\sright\??|(i\sam|i'm|i\swas)\s?right|amirite/i;

    if (amiriteRegex.test(content)) {
      await channel.send(getRandomValue(t("sass:amIRite")));
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
