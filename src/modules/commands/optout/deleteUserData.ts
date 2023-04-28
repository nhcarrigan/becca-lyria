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
        await Becca.db.activities.deleteMany({
          where: {
            userId,
          },
        });
        break;
      case "currency":
        await Becca.db.currencies.deleteMany({
          where: {
            userId,
          },
        });
        break;
      case "emote":
        await Becca.db.emotecounts.deleteMany({
          where: {
            userId,
          },
        });
        break;
      case "level":
        await Becca.db.newlevels.deleteMany({
          where: {
            userID: userId,
          },
        });
        break;
      case "star":
        // eslint-disable-next-line no-case-declarations
        const stars = await Becca.db.starcounts.findMany();
        for (const star of stars) {
          const userIndex = star.users.findIndex(
            (obj) => obj.userID === userId
          );
          if (userIndex !== -1) {
            star.users.splice(userIndex, 1);
            await Becca.db.starcounts.update({
              where: {
                serverID: star.serverID,
              },
              data: star,
            });
          }
        }
        break;
      case "vote":
        await Becca.db.voters.deleteMany({
          where: {
            userId,
          },
        });
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
