import OptOutModel from "../../database/models/OptOutModel";
import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { OptOut } from "../../interfaces/database/OptOut";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Fetches or generates an opt-out record for the given user.
 *
 * @param {BeccaLyria} Becca Becca's bot instance.
 * @param {string} userId The user's ID.
 * @returns {Promise<OptOut | null>} The opt-out record, or null if an error occurred.
 */
export const getOptOutRecord = async (
  Becca: BeccaLyria,
  userId: string
): Promise<OptOut | null> => {
  try {
    const record =
      (await OptOutModel.findOne({ userId })) ||
      (await OptOutModel.create({
        userId,
        activity: false,
        currency: false,
        emote: false,
        level: false,
        star: false,
        vote: false,
      }));
    return record;
  } catch (err) {
    await beccaErrorHandler(Becca, "get opt out record module", err);
    return null;
  }
};
