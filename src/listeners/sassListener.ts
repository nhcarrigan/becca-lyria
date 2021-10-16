/* eslint-disable jsdoc/require-jsdoc */
import { Listener } from "../interfaces/listeners/Listener";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const sassListener: Listener = {
  name: "sass",
  description: "Handles Becca's Sassy Mode!",
  run: async (Becca, message, config) => {
    try {
      const { author, channel, content, mentions } = message;
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
        await channel.send(Becca.sass.greeting);
      }

      const amiriteRegex =
        /(am|was)\s?i\sright\??|(i\sam|i'm|i\swas)\s?right|amirite/i;

      if (amiriteRegex.test(content)) {
        await channel.send(Becca.sass.amirite);
      }

      const sorryRegex =
        /(i'm|i\s?am)\s?sorry|(my\s?)?apologies|(i\s?)?(apologize|apologise)/i;

      if (
        sorryRegex.test(content) ||
        content === "sorry" ||
        content === "Sorry"
      ) {
        await channel.send(Becca.sass.sorry);
      }

      const thanksRegex =
        /((?:^|\s)(?:(?:th(?:n[qx]|x)|t[xyq]|tn(?:[x]){0,2})|\w*\s*[.,]*\s*than[kx](?:[sxz]){0,2}|than[kx](?:[sxz]){0,2}(?:[uq]|y(?:ou)?)?)|grazie|arigato(?:[u]{0,1})|doumo|gracias?|spasibo|dhanyavaad(?:hamulu)?|o?brigad(?:o|a)|dziekuje|(?:re)?merci|multumesc|shukra?an|danke)\b/gi;

      if (thanksRegex.test(content) && mentions.members?.size) {
        const replies = [];
        const members = mentions.members.map((u) => u);

        for (const member of members) {
          if (member.id === Becca.user?.id) {
            replies.push(Becca.sass.beccathanks);
            continue;
          }
          if (member.id === author.id) {
            replies.push(Becca.sass.selfthanks);
            continue;
          }
          replies.push(
            `Well done, ${member.displayName}. It seems you have done something right.`
          );
        }
        await channel.send(replies.join("\n"));
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
