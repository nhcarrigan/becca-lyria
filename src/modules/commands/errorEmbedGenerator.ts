import { EmbedBuilder } from "discord.js";
import { TFunction } from "i18next";
import { Types } from "mongoose";

import { BeccaLyria } from "../../interfaces/BeccaLyria";

/**
 * Generates an embed containing a unique ID for an error and instructions for
 * joining the support server and requesting assistance.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {string} commandName The name of the command that generated the error.
 * @param {Types.ObjectId} errorId The unique ID for the error.
 * @param {TFunction} t The i18n function.
 * @returns {EmbedBuilder} The Discord embed containing the information.
 */
export const errorEmbedGenerator = (
  Becca: BeccaLyria,
  commandName: string,
  errorId: Types.ObjectId,
  t: TFunction
): EmbedBuilder => {
  const errorEmbed = new EmbedBuilder();
  errorEmbed.setColor(Becca.colours.error);
  errorEmbed.setTitle(t<string, string>("defaults:errors.title"));
  errorEmbed.setDescription(
    t<string, string>("defaults:errors.description", { command: commandName })
  );
  errorEmbed.addFields([
    {
      name: t<string, string>("defaults:errors.what.title"),
      value: t<string, string>("defaults:errors.what.description"),
    },
    {
      name: t<string, string>("defaults:errors.wrong.title"),
      value: t<string, string>("defaults:errors.wrong.description"),
    },
    {
      name: t<string, string>("defaults:errors.fix.title"),
      value: t<string, string>("defaults:errors.fix.description"),
    },
    {
      name: t<string, string>("defaults:errors.id"),
      value: errorId.toHexString(),
    },
  ]);
  errorEmbed.setTimestamp();
  errorEmbed.setFooter({
    text: t<string, string>("defaults:donate"),
    iconURL: "https://cdn.nhcarrigan.com/profile.png",
  });
  return errorEmbed;
};
