/* eslint-disable jsdoc/require-param */

import { ListenerHandler } from "../../../interfaces/listeners/ListenerHandler";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Submodule for sorry comebacks.
 */
export const sassSorry: ListenerHandler = async (Becca, message) => {
  try {
    const { channel, content } = message;
    const sorryRegex =
      /(i'm|i\s?am)\s?sorry|(my\s?)?apologies|(i\s?)?(apologize|apologise)/i;

    if (sorryRegex.test(content) || content.toLowerCase() === "sorry") {
      await channel.send(Becca.sass.sorry);
    }
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "sorry sassListener",
      err,
      message.guild?.name,
      message
    );
  }
};
