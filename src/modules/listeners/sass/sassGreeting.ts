/* eslint-disable jsdoc/require-param */
import { DefaultTFuncReturn } from "i18next";

import { ListenerHandler } from "../../../interfaces/listeners/ListenerHandler";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Submodule for amirite comebacks.
 */
export const sassGreeting: ListenerHandler = async (Becca, message, t) => {
  try {
    const { channel, content } = message;

    const greetingRegex =
      /good\s(morning|afternoon|evening|night|day)|morning\severyone/i;
    if (greetingRegex.test(content) || content.toLowerCase() === "morning") {
      await channel.send(
        getRandomValue(
          t<string, DefaultTFuncReturn & string[]>("sass:greeting")
        )
      );
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
