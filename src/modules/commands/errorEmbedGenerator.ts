import { MessageEmbed } from "discord.js";
import { Types } from "mongoose";

import { BeccaLyria } from "../../interfaces/BeccaLyria";

/**
 * Generates an embed containing a unique ID for an error and instructions for
 * joining the support server and requesting assistance.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {string} commandName The name of the command that generated the error.
 * @param {Types.ObjectId} errorId The unique ID for the error.
 * @returns {MessageEmbed} The Discord embed containing the information.
 */
export const errorEmbedGenerator = (
  Becca: BeccaLyria,
  commandName: string,
  errorId: Types.ObjectId
): MessageEmbed => {
  const errorEmbed = new MessageEmbed();
  errorEmbed.setColor(Becca.colours.error);
  errorEmbed.setTitle(`Unknown Error`);
  errorEmbed.setDescription(`The ${commandName} spell has fizzled out.`);
  errorEmbed.addField(
    "What happened?",
    "Something went wrong with this command."
  );
  errorEmbed.addField(
    "Did I do something wrong?",
    "Errors can happen for a number of reasons. It could be an issue with the permissions you gave me, the code that powers me, or a number of other possibilities."
  );
  errorEmbed.addField(
    "So what can I do to fix it?",
    " If you need assistance with this feature, please [join our support server](https://chat.nhcarrigan.com). Once there, give this ErrorID to the support team to investigate."
  );
  errorEmbed.addField("Error ID:", errorId.toHexString());
  errorEmbed.setTimestamp();
  return errorEmbed;
};
