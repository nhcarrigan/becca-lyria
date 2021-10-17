/* eslint-disable jsdoc/require-param */

import { ListenerHandler } from "../../../interfaces/listeners/ListenerHandler";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Submodule for sorry comebacks.
 */
export const sassThanks: ListenerHandler = async (Becca, message, config) => {
  try {
    const { channel, content, mentions, author } = message;
    const thanksRegex =
      /((?:^|\s)(?:(?:th(?:n[qx]|x)|t[xyq]|tn(?:[x]){0,2})|\w*\s*[.,]*\s*than[kx](?:[sxz]){0,2}|than[kx](?:[sxz]){0,2}(?:[uq]|y(?:ou)?)?)|grazie|arigato(?:[u]?)|doumo|gracias?|spasibo|dhanyavaad(?:hamulu)?|o?brigad(?:[oa])|dziekuje|(?:re)?merci|multumesc|shukra?an|danke)\b/gi;

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
    await beccaErrorHandler(
      Becca,
      "thanks sassListener",
      err,
      message.guild?.name,
      message
    );
  }
};
