import { EmbedBuilder, Guild } from "discord.js";
import { TFunction } from "i18next";

import { defaultServer } from "../../../config/database/defaultServer";
import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { ServerConfig } from "../../../interfaces/database/ServerConfig";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";

/**
 * Parses a server's settings into an embed describing the basic
 * global information.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {Guild} guild The server to parse the settings for.
 * @param {TFunction} t The i18n translator function.
 * @param {ServerConfig} config The server's configuration object from the database.
 * @returns {EmbedBuilder | null} A message embed or null on error.
 */
export const viewAutomodSettings = async (
  Becca: BeccaLyria,
  guild: Guild,
  t: TFunction,
  config: ServerConfig
): Promise<EmbedBuilder | null> => {
  try {
    const settingsEmbed = new EmbedBuilder();
    settingsEmbed.setTitle(`${guild.name} Automod Settings`);
    settingsEmbed.setColor(Becca.colours.default);
    settingsEmbed.setDescription(t("commands:automod.view.embed.title"));
    settingsEmbed.addFields([
      {
        name: t("commands:automod.view.embed.link"),
        value: config.links || "off",
        inline: true,
      },
      {
        name: t("commands:automod.view.embed.profanity"),
        value: config.profanity || "off",
        inline: true,
      },
      {
        name: t("commands:automod.view.embed.linkRemoval"),
        value: customSubstring(
          config.link_message || defaultServer.link_message,
          1000
        ),
        inline: true,
      },
      {
        name: t("commands:automod.view.embed.profanityRemoval"),
        value: customSubstring(
          config.profanity_message || defaultServer.profanity_message,
          1000
        ),
        inline: true,
      },
      {
        name: t("commands:automod.view.embed.channels"),
        value: config.automod_channels.length.toString(),
        inline: true,
      },
      {
        name: t("commands:automod.view.embed.nonChannels"),
        value: config.no_automod_channels.length.toString(),
        inline: true,
      },
      {
        name: t("commands:automod.view.embed.exempt"),
        value: config.automod_roles.length.toString(),
        inline: true,
      },
      {
        name: t("commands:automod.view.embed.allowed"),
        value: config.allowed_links.length.toString(),
        inline: true,
      },
      {
        name: t("commands:automod.view.embed.antiphish"),
        value: config.antiphish || "none",
        inline: true,
      },
    ]);
    settingsEmbed.setFooter({
      text: "Like the bot? Donate: https://donate.nhcarrigan.com",
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });
    return settingsEmbed;
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "view automod settings module",
      err,
      guild.name
    );
    return null;
  }
};
