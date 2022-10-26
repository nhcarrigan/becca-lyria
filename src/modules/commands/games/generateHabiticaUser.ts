import axios from "axios";
import { EmbedBuilder } from "discord.js";
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
 * @returns {EmbedBuilder} The formatted Discord embed.
 */
export const generateHabiticaUser = async (
  Becca: BeccaLyria,
  t: TFunction,
  id: string,
  headers: HabiticaRequestHeaders
): Promise<EmbedBuilder> => {
  try {
    const user = await axios
      .get<HabiticaUser>(`https://habitica.com/api/v3/members/${id}`, {
        headers,
      })
      .catch(() => null);

    const userEmbed = new EmbedBuilder();

    if (!user || !user.data || !user.data.success) {
      userEmbed.setTitle(
        t<string, string>("commands:games.habitica.nouser.title")
      );
      userEmbed.setDescription(
        t<string, string>("commands:games.habitica.nouser.description")
      );
      return userEmbed;
    }

    const { auth, profile, stats } = user.data.data;
    const url = `https://habitica.com/profile/${id}`;

    userEmbed.setColor(Becca.colours.default);
    userEmbed.setTitle(
      t<string, string>("commands:games.habitica.user.title", {
        user: profile.name,
      })
    );
    userEmbed.setURL(url);
    userEmbed.setDescription(
      t<string, string>("commands:games.habitica.user.description", {
        user: auth.local.username,
      })
    );
    userEmbed.addFields([
      {
        name: t<string, string>("commands:games.habitica.user.class"),
        value: stats.class,
        inline: true,
      },
      {
        name: t<string, string>("commands:games.habitica.user.hp"),
        value: `${~~stats.hp}/${stats.maxHealth}`,
        inline: true,
      },
      {
        name: t<string, string>("commands:games.habitica.user.mp"),
        value: `${stats.mp}/${stats.maxMP}`,
        inline: true,
      },
      {
        name: t<string, string>("commands:games.habitica.user.stats"),
        value: t<string, string>("commands:games.habitica.user.values", {
          str: stats.str,
          con: stats.con,
          int: stats.int,
          per: stats.per,
        }),
      },
      {
        name: t<string, string>("commands:games.habitica.user.exp"),
        value: t<string, string>("commands:games.habitica.user.total", {
          exp: stats.exp,
          next: stats.toNextLevel,
        }),
      },
      {
        name: t<string, string>("commands:games.habitica.user.join"),
        value: new Date(auth.timestamps.created).toLocaleDateString(),
        inline: true,
      },
      {
        name: t<string, string>("commands:games.habitica.user.last"),
        value: new Date(auth.timestamps.loggedin).toLocaleDateString(),
        inline: true,
      },
    ]);
    userEmbed.setFooter({
      text: t<string, string>("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
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
