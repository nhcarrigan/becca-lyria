import axios from "axios";
import { MessageEmbed } from "discord.js";

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
 * @param {string} id The user's Habitica ID.
 * @param {HabiticaRequestHeaders} headers The headers to use for the request.
 * @returns {MessageEmbed} The formatted Discord embed.
 */
export const generateHabiticaUser = async (
  Becca: BeccaLyria,
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
      userEmbed.setTitle("User not found!");
      userEmbed.setDescription(
        "I am afraid I came back empty handed. That user does not appear to exist."
      );
      return userEmbed;
    }

    const { auth, profile, stats } = user.data.data;
    const url = `https://habitica.com/profile/${id}`;

    userEmbed.setColor(Becca.colours.default);
    userEmbed.setTitle(`${profile.name}'s Habitica Profile`);
    userEmbed.setURL(url);
    userEmbed.setDescription(`@${auth.local.username}: Stats`);
    userEmbed.addField("Class", stats.class, true);
    userEmbed.addField("HP", `${~~stats.hp}/${stats.maxHealth}`, true);
    userEmbed.addField("MP", `${stats.mp}/${stats.maxMP}`, true);
    userEmbed.addField(
      "Stats",
      `STR: ${stats.str}, CON: ${stats.con}, INT: ${stats.int}, PER: ${stats.per}`
    );
    userEmbed.addField(
      "Experience",
      `${stats.exp} - ${stats.toNextLevel} to reach the next level.`
    );
    userEmbed.addField(
      "Join date",
      new Date(auth.timestamps.created).toLocaleDateString(),
      true
    );
    userEmbed.addField(
      "Last seen",
      new Date(auth.timestamps.loggedin).toLocaleDateString(),
      true
    );

    return userEmbed;
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "habitica user generator",
      err
    );
    return errorEmbedGenerator(Becca, "habitica user generator", errorId);
  }
};
