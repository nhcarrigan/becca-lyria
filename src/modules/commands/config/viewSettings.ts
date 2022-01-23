import { Guild, MessageEmbed } from "discord.js";
import { TFunction } from "i18next";

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
 * @param {TFunction} t The i18n function.
 * @param {Guild} guild The server to parse the settings for.
 * @param {ServerConfig} config The server's configuration object from the database.
 * @returns {MessageEmbed | null} A message embed or null on error.
 */
export const viewSettings = async (
  Becca: BeccaLyria,
  t: TFunction,
  guild: Guild,
  config: ServerConfig
): Promise<MessageEmbed | null> => {
  try {
    const settingsEmbed = new MessageEmbed();
    settingsEmbed.setTitle(
      t("commands:config.view.title", { name: guild.name })
    );
    settingsEmbed.setColor(Becca.colours.default);
    settingsEmbed.setDescription(t("commands:config.view.description"));
    settingsEmbed.addField(
      t("commands:config.view.levels"),
      config.levels || "off",
      true
    );
    settingsEmbed.addField(
      t("commands:config.view.sass"),
      config.sass_mode || "off",
      true
    );
    settingsEmbed.addField(
      t("commands:config.view.welcome"),
      renderSetting(Becca, "welcome_channel", config.welcome_channel),
      true
    );
    settingsEmbed.addField(
      t("commands:config.view.leave"),
      renderSetting(Becca, "depart_channel", config.depart_channel),
      true
    );
    settingsEmbed.addField(
      t("commands:config.view.levellog"),
      renderSetting(Becca, "level_channel", config.level_channel),
      true
    );
    settingsEmbed.addField(
      t("commands:config.view.suggestion"),
      renderSetting(Becca, "suggestion_channel", config.suggestion_channel),
      true
    );
    settingsEmbed.addField(
      t("commands:config.view.report"),
      renderSetting(Becca, "report_channel", config.report_channel),
      true
    );
    settingsEmbed.addField(
      t("commands:config.view.join"),
      renderSetting(Becca, "join_role", config.join_role),
      true
    );
    settingsEmbed.addField(
      t("commands:config.view.levelrole"),
      config.level_roles.length.toString(),
      true
    );
    settingsEmbed.addField(
      t("commands:config.view.nolevel"),
      config.level_ignore.length.toString(),
      true
    );
    settingsEmbed.addField(
      t("commands:config.view.wmessage"),
      customSubstring(
        config.custom_welcome || defaultServer.custom_welcome,
        1000
      )
    );
    settingsEmbed.addField(
      t("commands:config.view.lmessage"),
      customSubstring(config.leave_message || defaultServer.leave_message, 2000)
    );
    settingsEmbed.addField(
      t("commands:config.view.hearts"),
      config.hearts.length.toString(),
      true
    );
    settingsEmbed.addField(
      t("commands:config.view.blocked"),
      config.blocked.length.toString(),
      true
    );
    settingsEmbed.addField(
      t("commands:config.view.selfrole"),
      config.self_roles.length.toString(),
      true
    );
    settingsEmbed.addField(
      t("commands:config.view.emote"),
      config.emote_channels.length.toString(),
      true
    );
    settingsEmbed.addField(
      t("commands:config.view.ban"),
      config.appeal_link || "not set",
      true
    );
    settingsEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
    });
    return settingsEmbed;
  } catch (err) {
    await beccaErrorHandler(Becca, "view settings module", err, guild.name);
    return null;
  }
};
