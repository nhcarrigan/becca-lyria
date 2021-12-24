import HistoryModel from "../../../database/models/HistoryModel";
import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { ModerationActions } from "../../../interfaces/commands/moderation/ModerationActions";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Saves a count of the user's moderation actions.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {ModerationActions} action The action taken against the user.
 * @param {string} userId The ID of the user being moderated.
 * @param {string} guildId The ID of the guild the moderation occurred in.
 */
export const updateHistory = async (
  Becca: BeccaLyria,
  action: ModerationActions,
  userId: string,
  guildId: string
) => {
  try {
    const userRecord =
      (await HistoryModel.findOne({
        serverId: guildId,
        userId: userId,
      })) ||
      (await HistoryModel.create({
        serverId: guildId,
        userId: userId,
        bans: 0,
        kicks: 0,
        mutes: 0,
        unmutes: 0,
        warns: 0,
      }));

    switch (action) {
      case "kick":
        userRecord.kicks++;
        break;
      case "ban":
        userRecord.bans++;
        break;
      case "mute":
        userRecord.mutes++;
        break;
      case "unmute":
        userRecord.unmutes++;
        break;
      case "warn":
        userRecord.warns++;
        break;
      default:
        break;
    }

    await userRecord.save();
  } catch (err) {
    await beccaErrorHandler(Becca, "update moderation history", err, guildId);
  }
};
