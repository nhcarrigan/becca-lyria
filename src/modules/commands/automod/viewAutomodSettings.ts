import { Guild, MessageEmbed } from "discord.js";
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
 * @returns {MessageEmbed | null} A message embed or null on error.
 */
export const viewAutomodSettings = async (
  Becca: BeccaLyria,
  guild: Guild,
  t: TFunction,
  config: ServerConfig
): Promise<MessageEmbed | null> => {
  try {
    const settingsEmbed = new MessageEmbed();
    settingsEmbed.setTitle(`${guild.name} Automod Settings`);
    settingsEmbed.setColor(Becca.colours.default);
    settingsEmbed.setDescription(t("commands:automod.view.embed.title"));
    settingsEmbed.addField(
      t("commands:automod.view.embed.link"),
      config.links || "off",
      true
    );
    settingsEmbed.addField(
      t("commands:automod.view.embed.profanity"),
      config.profanity || "off",
      true
    );
    settingsEmbed.addField(
      t("commands:automod.view.embed.linkRemoval"),
      customSubstring(config.link_message || defaultServer.link_message, 1000)
    );
    settingsEmbed.addField(
      t("commands:automod.view.embed.profanityRemoval"),
      customSubstring(
        config.profanity_message || defaultServer.profanity_message,
        1000
      )
    );
    settingsEmbed.addField(
      t("commands:automod.view.embed.channels"),
      config.automod_channels.length.toString(),
      true
    );
    settingsEmbed.addField(
      t("commands:automod.view.embed.nonChannels"),
      config.no_automod_channels.length.toString(),
      true
    );
    settingsEmbed.addField(
      t("commands:automod.view.embed.exempt"),
      config.automod_roles.length.toString(),
      true
    );
    settingsEmbed.addField(
      t("commands:automod.view.embed.allowed"),
      config.allowed_links.length.toString(),
      true
    );
    settingsEmbed.addField(
      t("commands:automod.view.embed.antiphish"),
      config.antiphish || "none",
      true
    );
    settingsEmbed.setFooter(
      "Like the bot? Donate: https://donate.nhcarrigan.com",
      "https://cdn.nhcarrigan.com/profile.png"
    );
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
