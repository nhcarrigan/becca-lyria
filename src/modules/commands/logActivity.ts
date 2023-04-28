import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { getOptOutRecord } from "../listeners/getOptOutRecord";

/**
 * Provided the user has not opted out from bot activity tracking, this fetches or
 * creates the user's activity record from the database. Then it increments the counter
 * for the type of activity passed in, and saves the record.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {string} user The Discord ID for the user to update.
 * @param {string} activity The type of activity to increase the count for.
 */
export const logActivity = async (
  Becca: BeccaLyria,
  user: string,
  activity: "button" | "command" | "select" | "context"
): Promise<void> => {
  try {
    const optout = await getOptOutRecord(Becca, user);

    if (!optout || optout.activity) {
      return;
    }

    const userActivity = await Becca.db.activities.upsert({
      where: {
        userId: user,
      },
      update: {},
      create: {
        userId: user,
        buttons: 0,
        commands: 0,
        selects: 0,
        contexts: 0,
      },
    });

    switch (activity) {
      case "button":
        userActivity.buttons++;
        break;
      case "command":
        userActivity.commands++;
        break;
      case "select":
        userActivity.selects++;
        break;
      case "context":
        userActivity.contexts++;
        break;
      default:
        break;
    }

    await Becca.db.activities.update({
      where: {
        userId: user,
      },
      data: userActivity,
    });
  } catch (err) {
    await beccaErrorHandler(Becca, "activity logger", err);
  }
};
