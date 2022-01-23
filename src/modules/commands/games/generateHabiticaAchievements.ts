import axios from "axios";
import { MessageEmbed } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import {
  HabiticaAchievement,
  HabiticaAchievementResponse,
  HabiticaRequestHeaders,
} from "../../../interfaces/commands/games/Habitica";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../errorEmbedGenerator";

const getAchievementList = (achievements: HabiticaAchievement[]): string => {
  const list = achievements
    .filter((el) => el.earned)
    .map((el) => el.title)
    .join(", ");

  // Check if the list is not empty.
  if (list.length) {
    return list;
  } else {
    return "None";
  }
};

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
export const generateHabiticaAchievements = async (
  Becca: BeccaLyria,
  t: TFunction,
  id: string,
  headers: HabiticaRequestHeaders
): Promise<MessageEmbed> => {
  try {
    const achievements = await axios
      .get<HabiticaAchievementResponse>(
        `https://habitica.com/api/v3/members/${id}/achievements`,
        { headers }
      )
      .catch(() => null);

    const achievementsEmbed = new MessageEmbed();

    // Check if the user achievements data result is not success.
    if (!achievements || !achievements.data || !achievements.data.success) {
      achievementsEmbed.setTitle(t("commands:games.habitica.noach.title"));
      achievementsEmbed.setDescription(
        t("commands:games.habitica.noach.description")
      );
      return achievementsEmbed;
    }

    const { basic, onboarding, seasonal, special } = achievements.data.data;

    achievementsEmbed.setColor(Becca.colours.default);
    achievementsEmbed.setTitle(t("commands:games.habitica.achievements.title"));
    achievementsEmbed.addField(
      t("commands:games.habitica.achievements.basic"),
      getAchievementList(Object.values(basic.achievements))
    );
    achievementsEmbed.addField(
      t("commands:games.habitica.achievements.onboarding"),
      getAchievementList(Object.values(onboarding.achievements))
    );
    achievementsEmbed.addField(
      t("commands:games.habitica.achievements.season"),
      getAchievementList(Object.values(seasonal.achievements))
    );
    achievementsEmbed.addField(
      t("commands:games.habitica.achievements.special"),
      getAchievementList(Object.values(special.achievements))
    );
    achievementsEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
    });

    return achievementsEmbed;
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "habitica achievements generator",
      err
    );
    return errorEmbedGenerator(
      Becca,
      "habitica achievements generator",
      errorId
    );
  }
};
