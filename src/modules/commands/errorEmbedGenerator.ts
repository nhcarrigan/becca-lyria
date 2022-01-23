import { MessageEmbed } from "discord.js";
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
 * @returns {MessageEmbed} The Discord embed containing the information.
 */
export const errorEmbedGenerator = (
  Becca: BeccaLyria,
  commandName: string,
  errorId: Types.ObjectId,
  t: TFunction
): MessageEmbed => {
  const errorEmbed = new MessageEmbed();
  errorEmbed.setColor(Becca.colours.error);
  errorEmbed.setTitle(t("defaults:errors.title"));
  errorEmbed.setDescription(
    t("defaults:errors.description", { command: commandName })
  );
  errorEmbed.addField(
    t("defaults:errors.what.title"),
    t("defaults.errors.what.description")
  );
  errorEmbed.addField(
    t("defaults:errors.wrong.title"),
    t("defaults:errors.wrong.description")
  );
  errorEmbed.addField(
    t("defaults:errors.fix.title"),
    t("defaults:errors.fix.description")
  );
  errorEmbed.addField(t("defaults:errors.id"), errorId.toHexString());
  errorEmbed.setTimestamp();
  errorEmbed.setFooter({
    text: t("defaults:donate"),
    iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png/*  */",
  });
  return errorEmbed;
};
