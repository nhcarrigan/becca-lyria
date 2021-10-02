import LevelModel from "../../database/models/LevelModel";
import StarModel from "../../database/models/StarModel";
import { BeccaInt } from "../../interfaces/BeccaInt";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const memberRemoveCleanup = async (
  Becca: BeccaInt,
  userId: string,
  guildId: string
) => {
  try {
    const levelData = await LevelModel.findOne({ serverID: guildId });

    if (levelData) {
      const index = levelData.users.findIndex((user) => user.userID === userId);
      if (index !== -1) {
        levelData.users.splice(index, 1);
        levelData.markModified("users");
        await levelData.save();
      }
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
