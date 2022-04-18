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
    let scamSource = "";

    for (const link of blockedLinkList) {
      const encodedLink = encodeURI(
        link.replace(/https?:\/\//, "").split("/")[0]
      );
      const checkHeptagramAPI = await axios
        .get<boolean>(
          `http://api.heptagrambotproject.com/api/v0/api/scam/link/check?url=${encodedLink}`,
          {
            // send authentication header
            headers: {
              Authorization: "Bearer " + Becca.configs.heptagramApiToken,
            },
          }
        )
        .catch(async (err) => {
          await Becca.debugHook.send({
            embeds: [
              {
                title: "Heptagram Api Error",
                description: JSON.stringify(err, null, 2),
                fields: [
                  {
                    name: "Link Detected",
                    value: link,
                  },
                ],
              },
            ],
          });
          return { data: false };
        });

      if (checkHeptagramAPI.data) {
        scamDetected = true;
        scamLink = link;
        scamSource = "Heptagram";
        break;
      }

      const checkWalshyAPI = await axios
        .post<{
          badDomain: boolean;
          detection: "discord" | "community";
        }>("https://bad-domains.walshy.dev/check", {
          domain: link,
        })
        .catch(async (err) => {
          await Becca.debugHook.send({
            embeds: [
              {
                title: "Walshy Api Error",
                description: JSON.stringify(err, null, 2),
                fields: [
                  {
                    name: "Link Detected",
                    value: link,
                  },
                ],
              },
            ],
          });
          return { data: { badDomain: false } };
        });

      if (checkWalshyAPI.data.badDomain) {
        scamDetected = true;
        scamLink = link;
        scamSource = "walshy";
        break;
      }

      const checkSinkingYachtsAPI = await axios
        .get<boolean>(`https://phish.sinking.yachts/v2/check/${encodedLink}`, {
          headers: {
            accept: "application/json",
            "X-Identity": "Becca Lyria - built by Naomi#0001",
          },
        })
        .catch(async (err) => {
          await Becca.debugHook.send({
            embeds: [
              {
                title: "Sinking Yachts Api Error",
                description: JSON.stringify(err, null, 2),
                fields: [
                  {
                    name: "Link Detected",
                    value: link,
                  },
                ],
              },
            ],
          });
          return { data: false };
        });

      if (checkSinkingYachtsAPI.data) {
        scamDetected = true;
        scamLink = link;
        scamSource = "sinking yachts";
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
      t("listeners:automod.antiphish.dm")
    );

    const reason = t("listeners:automod.antiphish.reason");

    switch (config.antiphish) {
      case "mute":
        await message.member.timeout(86400000, reason);
        break;
      case "kick":
        await message.member.kick(reason);
        break;
      case "ban":
        await message.member.ban({ reason });
        break;
      default:
        break;
    }

    const logEmbed = new MessageEmbed();
    logEmbed.setTitle(t("listeners:automod.antiphish.title"));
    logEmbed.setDescription(t("listeners:automod.antiphish.description"));
    logEmbed.addField(
      t("listeners:automod.antiphish.user"),
      message.author.tag,
      true
    );
    logEmbed.addField(t("listeners:automod.antiphish.link"), scamLink, true);
    logEmbed.addField(
      t("listeners:automod.antiphish.action"),
      config.antiphish,
      true
    );
    logEmbed.addField(
      t("listeners:automod.antiphish.source"),
      scamSource,
      true
    );

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
