import { MessageEmbed } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { ServerConfig } from "../../../interfaces/database/ServerConfig";
import { ArraySettings } from "../../../interfaces/settings/ArraySettings";
import { renderSetting } from "../../../modules/settings/renderSetting";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Parses a settings array into a paginated embed, with array values
 * stored in the description separated by new lines.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {TFunction} t The i18n function.
 * @param {ServerConfig} config The server's settings from the database.
 * @param {ArraySettings} setting The setting to be parsed.
 * @param {number} page The page number for the current embed.
 * @returns {MessageEmbed | null} The parsed embed, or null on error.
 */
export const viewSettingsArray = async (
  Becca: BeccaLyria,
  t: TFunction,
  config: ServerConfig,
  setting: ArraySettings,
  page: number
): Promise<MessageEmbed | null> => {
  try {
    const data = config[setting];

    const settingEmbed = new MessageEmbed();
    settingEmbed.setTitle(
      t("commands:config.settingsArray.title", { setting })
    );
    settingEmbed.setTimestamp();
    settingEmbed.setColor(Becca.colours.default);

    if (!data || !data.length) {
      settingEmbed.setDescription(t("commands:config.settingsArray.none"));
      settingEmbed.setFooter({
        text: t("commands:config.settingsArray.page", { page: 1, pages: 1 }),
      });
      return settingEmbed;
    }

    const pages = Math.ceil(data.length / 10);
    const paginatedData = data
      .slice(page * 10 - 10, page * 10)
      .map((el) => renderSetting(Becca, setting, el));

    settingEmbed.setDescription(paginatedData.join("\n"));
    settingEmbed.setFooter({
      text: t("commands:config.settingsArray.page", { page, pages }),
    });
    return settingEmbed;
  } catch (err) {
    await beccaErrorHandler(Becca, "view settings array module", err);
    return null;
  }
};
