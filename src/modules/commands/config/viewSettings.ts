import { servers } from "@prisma/client";
import { Guild, EmbedBuilder } from "discord.js";
import { TFunction } from "i18next";

import { defaultServer } from "../../../config/database/defaultServer";
import { BeccaLyria } from "../../../interfaces/BeccaLyria";
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
 * @param {servers} config The server's configuration object from the database.
 * @returns {EmbedBuilder | null} A message embed or null on error.
 */
export const viewSettings = async (
  Becca: BeccaLyria,
  t: TFunction,
  guild: Guild,
  config: servers
): Promise<EmbedBuilder | null> => {
  try {
    const settingsEmbed = new EmbedBuilder();
    settingsEmbed.setTitle(
      t("commands:config.view.title", { name: guild.name })
    );
    settingsEmbed.setColor(Becca.colours.default);
    settingsEmbed.setDescription(t("commands:config.view.description"));
    settingsEmbed.addFields([
      {
        name: t("commands:config.view.levels"),
        value: config.levels || "off",
        inline: true,
      },
      {
        name: t("commands:config.view.sass"),
        value: config.sass_mode || "off",
        inline: true,
      },
      {
        name: t("commands:config.view.welcome"),
        value: renderSetting(Becca, "welcome_channel", config.welcome_channel),
        inline: true,
      },
      {
        name: t("commands:config.view.leave"),
        value: renderSetting(Becca, "depart_channel", config.depart_channel),
        inline: true,
      },
      {
        name: t("commands:config.view.levellog"),
        value: renderSetting(Becca, "level_channel", config.level_channel),
        inline: true,
      },
      {
        name: t("commands:config.view.suggestion"),
        value: renderSetting(
          Becca,
          "suggestion_channel",
          config.suggestion_channel
        ),
        inline: true,
      },
      {
        name: t("commands:config.view.report"),
        value: renderSetting(Becca, "report_channel", config.report_channel),
        inline: true,
      },
      {
        name: t("commands:config.view.join"),
        value: renderSetting(Becca, "join_role", config.join_role),
        inline: true,
      },
      {
        name: t("commands:config.view.levelrole"),
        value: config.level_roles.length.toString(),
        inline: true,
      },
      {
        name: t("commands:config.view.nolevel"),
        value: config.level_ignore.length.toString(),
        inline: true,
      },
      {
        name: t("commands:config.view.wmessage"),
        value: customSubstring(
          config.custom_welcome || defaultServer.custom_welcome,
          1000
        ),
        inline: true,
      },
      {
        name: t("commands:config.view.lmessage"),
        value: customSubstring(
          config.leave_message || defaultServer.leave_message,
          2000
        ),
        inline: true,
      },
      {
        name: t("commands:config.view.hearts"),
        value: config.hearts.length.toString(),
        inline: true,
      },
      {
        name: t("commands:config.view.blocked"),
        value: config.blocked.length.toString(),
        inline: true,
      },
      {
        name: t("commands:config.view.emote"),
        value: config.emote_channels.length.toString(),
        inline: true,
      },
      {
        name: t("commands:config.view.ban"),
        value: config.appeal_link || "not set",
        inline: true,
      },
      {
        name: t("commands:config.view.initialXp"),
        value: config.initial_xp,
        inline: true,
      },
      {
        name: t("commands:config.view.levelStyle"),
        value: config.level_style,
        inline: true,
      },
      {
        name: t("commands:config.view.levelMessage"),
        value: customSubstring(
          config.level_message ||
            t("listeners:level.desc", {
              user: "{@user}",
              level: "{level}",
            }),
          1000
        ),
      },
      {
        name: t("commands:config.view.roleMessage"),
        value: customSubstring(
          config.role_message ||
            t("listeners:level.roleDesc", {
              user: "{@user}",
              role: "{@role}",
            }),
          1000
        ),
        inline: true,
      },
    ]);
    settingsEmbed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });
    return settingsEmbed;
  } catch (err) {
    await beccaErrorHandler(Becca, "view settings module", err, guild.name);
    return null;
  }
};
