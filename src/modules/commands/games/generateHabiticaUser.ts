import axios from "axios";
import { MessageEmbed } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import {
  HabiticaRequestHeaders,
  HabiticaUser,
} from "../../../interfaces/commands/games/Habitica";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../errorEmbedGenerator";

/**
 * Fetches a user's Habitica profile and returns the data
 * formatted in an embed.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {TFunction} t The i18n function.
 * @param {string} id The user's Habitica ID.
 * @param {HabiticaRequestHeaders} headers The headers to use for the request.
 * @returns {MessageEmbed} The formatted Discord embed.
 */
export const generateHabiticaUser = async (
  Becca: BeccaLyria,
  t: TFunction,
  id: string,
  headers: HabiticaRequestHeaders
): Promise<MessageEmbed> => {
  try {
    const user = await axios
      .get<HabiticaUser>(`https://habitica.com/api/v3/members/${id}`, {
        headers,
      })
      .catch(() => null);

    const userEmbed = new MessageEmbed();

    if (!user || !user.data || !user.data.success) {
      userEmbed.setTitle(t("commands:games.habitica.nouser.title"));
      userEmbed.setDescription(t("commands:games.habitica.nouser.description"));
      return userEmbed;
    }

    const { auth, profile, stats } = user.data.data;
    const url = `https://habitica.com/profile/${id}`;

    userEmbed.setColor(Becca.colours.default);
    userEmbed.setTitle(
      t("commands:games.habitica.user.title", { user: profile.name })
    );
    userEmbed.setURL(url);
    userEmbed.setDescription(
      t("commands:games.habitica.user.description", {
        user: auth.local.username,
      })
    );
    userEmbed.addField(
      t("commands:games.habitica.user.class"),
      stats.class,
      true
    );
    userEmbed.addField(
      t("commands:games.habitica.user.hp"),
      `${~~stats.hp}/${stats.maxHealth}`,
      true
    );
    userEmbed.addField(
      t("commands:games.habitica.user.mp"),
      `${stats.mp}/${stats.maxMP}`,
      true
    );
    userEmbed.addField(
      t("commands:games.habitica.user.stats"),
      t("commands:games.habitica.user.values", {
        str: stats.str,
        con: stats.con,
        int: stats.int,
        per: stats.per,
      })
    );
    userEmbed.addField(
      t("commands:games.habitica.user.exp"),
      t("commands:games.habitica.user.total", {
        exp: stats.exp,
        next: stats.toNextLevel,
      })
    );
    userEmbed.addField(
      t("commands:games.habitica.user.join"),
      new Date(auth.timestamps.created).toLocaleDateString(),
      true
    );
    userEmbed.addField(
      t("commands:games.habitica.user.last"),
      new Date(auth.timestamps.loggedin).toLocaleDateString(),
      true
    );
    userEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
    });

    return userEmbed;
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "habitica user generator",
      err
    );
    return errorEmbedGenerator(Becca, "habitica user generator", errorId, t);
  }
};
