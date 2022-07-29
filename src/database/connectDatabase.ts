import { EmbedBuilder } from "discord.js";
import { connect } from "mongoose";

import { BeccaLyria } from "../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

/**
 * Instantiates the database connection.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @returns {boolean} True if the connection was successful.
 */
export const connectDatabase = async (Becca: BeccaLyria): Promise<boolean> => {
  try {
    await connect(Becca.configs.dbToken);

    const databaseEmbed = new EmbedBuilder();
    databaseEmbed.setTitle("Database connected!");
    databaseEmbed.setDescription(
      `${Becca.user?.username || "Becca Lyria"} has found her record room.`
    );
    databaseEmbed.setTimestamp();
    databaseEmbed.setColor(Becca.colours.success);
    await Becca.debugHook.send({ embeds: [databaseEmbed] });

    return true;
  } catch (err) {
    await beccaErrorHandler(Becca, "database connection", err);
    return false;
  }
};
