import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { getCounts } from "../becca/getCounts";

/**
 * Fetches the current guild list, then generates the guild and
 * member counts and passes them to the analytics module.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 */
export const postDailyAnalytics = async (Becca: BeccaLyria) => {
  try {
    await Becca.guilds.fetch();
    const counts = getCounts(Becca);
    await Becca.analytics.updateDailyCounts(counts.guilds, counts.members);
  } catch (err) {
    await beccaErrorHandler(Becca, "post daily analytics", err);
  }
};
