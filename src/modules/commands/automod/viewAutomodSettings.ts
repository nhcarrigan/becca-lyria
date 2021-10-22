import { Guild, MessageEmbed } from "discord.js";

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
 * @param {ServerConfig} config The server's configuration object from the database.
 * @returns {MessageEmbed | null} A message embed or null on error.
 */
export const viewAutomodSettings = async (
  Becca: BeccaLyria,
  guild: Guild,
  config: ServerConfig
): Promise<MessageEmbed | null> => {
  try {
    const settingsEmbed = new MessageEmbed();
    settingsEmbed.setTitle(`${guild.name} Automod Settings`);
    settingsEmbed.setColor(Becca.colours.default);
    settingsEmbed.setDescription(
      "Here are your current automod configurations."
    );
    settingsEmbed.addField("Link Detection", config.links || "off", true);
    settingsEmbed.addField(
      "Profanity Detection",
      config.profanity || "off",
      true
    );
    settingsEmbed.addField(
      "Link removal message",
      customSubstring(config.link_message || defaultServer.link_message, 1000)
    );
    settingsEmbed.addField(
      "Profanity removal message",
      customSubstring(
        config.profanity_message || defaultServer.profanity_message,
        1000
      )
    );
    settingsEmbed.addField(
      "Automodded Channels",
      config.automod_channels.length.toString(),
      true
    );
    settingsEmbed.addField(
      "Non-Automodded Channels",
      config.no_automod_channels.length.toString(),
      true
    );
    settingsEmbed.addField(
      "Automod Exempt Roles",
      config.automod_roles.length.toString(),
      true
    );
    settingsEmbed.addField(
      "Allowed Links",
      config.allowed_links.length.toString(),
      true
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
