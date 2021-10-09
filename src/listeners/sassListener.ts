/* eslint-disable jsdoc/require-jsdoc */
import { ListenerInt } from "../interfaces/listeners/ListenerInt";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const sassListener: ListenerInt = {
  name: "sass",
  description: "Handles Becca's Sassy Mode!",
  run: async (Becca, message, config) => {
    try {
      const { channel, content } = message;
      if (config.sass_mode !== "on" || !message.content) {
        return;
      }

      const greetingRegex =
        /good\s(morning|afternoon|evening|night|day)|morning\severyone/i;

      if (
        greetingRegex.test(content) ||
        content === "morning" ||
        content === "Morning"
      ) {
        await channel.send("greeting");
      }

      const amiriteRegex =
        /(am|was)\s?i\sright\??|(i\sam|i'm|i\swas)\s?right|amirite/i;

      if (amiriteRegex.test(content)) {
        await channel.send("amirite");
      }

      const sorryRegex =
        /(i'm|i\s?am)\s?sorry|(my\s?)?apologies|(i\s?)?(apologize|apologise)/;

      if (
        sorryRegex.test(content) ||
        content === "sorry" ||
        content === "Sorry"
      ) {
        await channel.send("sorry");
      }
    } catch (err) {
      beccaErrorHandler(
        Becca,
        "links listener",
        err,
        message.guild?.name,
        message
      );
    }
  },
};
