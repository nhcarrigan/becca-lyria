/* eslint-disable jsdoc/require-param */

import { ListenerHandler } from "../../../interfaces/listeners/ListenerHandler";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Submodule for amirite comebacks.
 */
export const sassGreeting: ListenerHandler = async (Becca, message, config) => {
  try {
    const { channel, content } = message;

    const greetingRegex =
      /good\s(morning|afternoon|evening|night|day)|morning\severyone/i;
    if (greetingRegex.test(content) || content.toLowerCase() === "morning") {
      await channel.send(Becca.sass.greeting);
    }
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "greeting sassListener",
      err,
      message.guild?.name,
      message
    );
  }
};
