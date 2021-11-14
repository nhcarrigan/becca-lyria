import LevelModel from "../../database/models/LevelModel";
import StarModel from "../../database/models/StarModel";
import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Module to clean up a user's level and star data when
 * they leave a guild.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {string} userId Discord ID of the user that left the guild.
 * @param {string} guildId Discord ID of the guild the user left.
 */
export const memberRemoveCleanup = async (
  Becca: BeccaLyria,
  userId: string,
  guildId: string
): Promise<void> => {
  try {
    const levelData = await LevelModel.findOne({
      serverID: guildId,
      userID: userId,
    });

    if (levelData) {
      await levelData.delete();
    }

    const starData = await StarModel.findOne({ serverID: guildId });

    if (starData) {
      const index = starData.users.findIndex((user) => user.userID === userId);
      if (index !== -1) {
        starData.users.splice(index, 1);
        starData.markModified("users");
        await starData.save();
      }
    }
  } catch (error) {
    await beccaErrorHandler(Becca, "member cleanup helper", error);
  }
};
