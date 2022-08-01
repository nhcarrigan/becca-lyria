import ActivityModel from "../../../database/models/ActivityModel";
import CurrencyModel from "../../../database/models/CurrencyModel";
import EmoteCountModel from "../../../database/models/EmoteCountModel";
import LevelModel from "../../../database/models/LevelModel";
import StarModel from "../../../database/models/StarModel";
import VoterModel from "../../../database/models/VoterModel";
import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { OptOutSettings } from "../../../interfaces/settings/OptOutSettings";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Module to delete all of a user's data associated with a specific feature.
 *
 * @param {BeccaLyria} Becca Becca's Discord bot instance.
 * @param {string} userId The ID of the user to clean up.
 * @param {OptOutSettings} type The type of data to clean up.
 * @returns {boolean} Whether or not the data was deleted.
 */
export const deleteUserData = async (
  Becca: BeccaLyria,
  userId: string,
  type: OptOutSettings
): Promise<boolean> => {
  try {
    switch (type) {
      case "activity":
        await ActivityModel.deleteMany({ userId });
        break;
      case "currency":
        await CurrencyModel.deleteMany({ userId });
        break;
      case "emote":
        await EmoteCountModel.deleteMany({ userId });
        break;
      case "level":
        await LevelModel.deleteMany({ userID: userId });
        break;
      case "star":
        // eslint-disable-next-line no-case-declarations
        const stars = await StarModel.find({});
        for (const star of stars) {
          const userIndex = star.users.findIndex(
            (obj) => obj.userID === userId
          );
          if (userIndex !== -1) {
            star.users.splice(userIndex, 1);
            star.markModified("users");
            await star.save();
          }
        }
        break;
      case "vote":
        await VoterModel.deleteMany({ userId });
        break;
      default:
        return false;
    }
    return true;
  } catch (err) {
    await beccaErrorHandler(Becca, "delete user data module", err);
    return false;
  }
};
