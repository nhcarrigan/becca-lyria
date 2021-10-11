import { Guild, MessageEmbed } from "discord.js";

import { defaultServer } from "../../../config/database/defaultServer";
import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { ServerConfig } from "../../../interfaces/database/ServerConfig";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";
import { renderSetting } from "../../settings/renderSetting";

/**
 * Parses a server's settings into an embed describing the basic
 * global information.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {Guild} guild The server to parse the settings for.
 * @param {ServerConfig} config The server's configuration object from the database.
 * @returns {MessageEmbed | null} A message embed or null on error.
 */
export const viewSettings = (
  Becca: BeccaLyria,
  guild: Guild,
  config: ServerConfig
): MessageEmbed | null => {
  try {
    const settingsEmbed = new MessageEmbed();
    settingsEmbed.setTitle(`${guild.name} Settings`);
    settingsEmbed.setColor(Becca.colours.default);
    settingsEmbed.setDescription("Here are your current configurations.");
    settingsEmbed.addField("Thanks Listener", config.thanks || "off", true);
    settingsEmbed.addField("Levels Listener", config.levels || "off", true);
    settingsEmbed.addField("Sass Mode", config.sass_mode || "off", true);
    settingsEmbed.addField(
      "Welcome Channel",
      renderSetting(Becca, "welcome_channel", config.welcome_channel),
      true
    );
    settingsEmbed.addField(
      "Level Logging Channel",
      renderSetting(Becca, "level_channel", config.level_channel),
      true
    );
    settingsEmbed.addField(
      "Suggestion Channel",
      renderSetting(Becca, "suggestion_channel", config.suggestion_channel),
      true
    );
    settingsEmbed.addField(
      "Report Channel",
      renderSetting(Becca, "report_channel", config.report_channel),
      true
    );
    settingsEmbed.addField(
      "Muted Role",
      renderSetting(Becca, "muted_role", config.muted_role),
      true
    );
    settingsEmbed.addField(
      "Join Role",
      renderSetting(Becca, "join_role", config.join_role),
      true
    );
    settingsEmbed.addField(
      "Level Based Roles",
      config.level_roles.length.toString(),
      true
    );
    settingsEmbed.addField(
      "No Levels Channels",
      config.level_ignore.length.toString(),
      true
    );
    settingsEmbed.addField(
      "Custom Welcome Message",
      customSubstring(
        config.custom_welcome || defaultServer.custom_welcome,
        1000
      )
    );
    settingsEmbed.addField(
      "Custom Leave Message",
      customSubstring(config.leave_message || defaultServer.leave_message, 2000)
    );
    settingsEmbed.addField(
      "Hearts Count",
      config.hearts.length.toString(),
      true
    );
    settingsEmbed.addField(
      "Blocked User Count",
      config.blocked.length.toString(),
      true
    );
    settingsEmbed.addField(
      "Self Assignable Titles",
      config.self_roles.length.toString(),
      true
    );
    settingsEmbed.addField(
      "No links channels",
      config.anti_links.length.toString(),
      true
    );
    settingsEmbed.addField(
      "Allowed link channels",
      config.permit_links.length.toString(),
      true
    );
    settingsEmbed.addField(
      "Anti-link Bypass Roles",
      config.automod_roles.length.toString(),
      true
    );
    settingsEmbed.addField(
      "Allowed Links",
      config.allowed_links.length.toString(),
      true
    );
    settingsEmbed.addField(
      "Link removal message",
      customSubstring(config.link_message || defaultServer.link_message, 1000)
    );
    return settingsEmbed;
  } catch (err) {
    beccaErrorHandler(Becca, "view settings module", err, guild.name);
    return null;
  }
};
