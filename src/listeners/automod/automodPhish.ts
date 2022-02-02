/* eslint-disable jsdoc/require-param */
import axios from "axios";
import { MessageEmbed } from "discord.js";

import { ListenerHandler } from "../../interfaces/listeners/ListenerHandler";
import { sendLogEmbed } from "../../modules/guild/sendLogEmbed";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { sendModerationDm } from "../../utils/sendModerationDm";

/**
 * Handles phishing links.
 *
 * @returns {boolean} If a scam link was detected.
 */
export const automodPhish: ListenerHandler = async (
  Becca,
  message,
  t,
  config
) => {
  try {
    if (
      !config.antiphish ||
      config.antiphish === "none" ||
      !message.member ||
      !message.guild
    ) {
      return false;
    }
    const contentWithoutCode = message.content.replace(
      /`{3}([\S]+)?\n((?!`{3})((?!```)[\s\S])+)\n`{3}/gi,
      ""
    );

    const blockedLinkList: string[] = [];

    const linkRegex =
      /(https?:\/\/(([a-z0-9-]+\.)+([a-z]{2,})))(:[\d]{1,5})?[^\s]*/gi;

    const blockedMatches = contentWithoutCode.match(linkRegex);
    if (blockedMatches) {
      blockedLinkList.push(...blockedMatches);
    }

    let scamDetected = false;
    let scamLink = "";

    for (const link of blockedLinkList) {
      const checkForScam = await axios.post<{
        badDomain: boolean;
        detection: "discord" | "community";
      }>("https://bad-domains.walshy.dev/check", {
        domain: link,
      });

      if (checkForScam.data.badDomain) {
        scamDetected = true;
        scamLink = link;
        break;
      }
    }

    if (!scamDetected) {
      return false;
    }

    await message.delete();

    await sendModerationDm(
      Becca,
      config,
      t,
      config.antiphish,
      message.author,
      "A scam link was detected in one of your messages. Please reset your password."
    );

    switch (config.antiphish) {
      case "mute":
        await message.member.timeout(86400000, "scam links");
        break;
      case "kick":
        await message.member.kick("scam links");
        break;
      case "ban":
        await message.member.ban({ reason: "scam links" });
        break;
      default:
        break;
    }

    const logEmbed = new MessageEmbed();
    logEmbed.setTitle("Scam detected!");
    logEmbed.setDescription("A scam link was detected in the server.");
    logEmbed.addField("User", message.author.tag, true);
    logEmbed.addField("Link", scamLink, true);
    logEmbed.addField("Action", config.antiphish, true);

    await sendLogEmbed(Becca, message.guild, logEmbed, "moderation_events");

    return true;
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "links automodder",
      err,
      message.guild?.name,
      message
    );
  }
};
