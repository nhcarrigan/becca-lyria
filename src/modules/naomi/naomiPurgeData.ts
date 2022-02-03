import { Message } from "discord.js";

import ActivityModel from "../../database/models/ActivityModel";
import CommandCountModel from "../../database/models/CommandCountModel";
import CurrencyModel from "../../database/models/CurrencyModel";
import EmoteCountModel from "../../database/models/EmoteCountModel";
import LevelModel from "../../database/models/LevelModel";
import StarModel from "../../database/models/StarModel";
import VoterModel from "../../database/models/VoterModel";
import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Owner-only module to purge user data from the database.
 *
 * @param {BeccaLyria} Becca Becca's discord instance.
 * @param {Message} message The message payload from Discord.
 */
export const naomiPurgeData = async (Becca: BeccaLyria, message: Message) => {
  try {
    // Naomi purge <data> <id>
    const [, , data, target] = message.content.split(" ");
    let name = "No data found!";

    if (data === "levels") {
      const levels = await LevelModel.find({ userID: target });
      for (const datum of levels) {
        await datum.delete();
        name = datum.userTag;
      }
      await message.reply(`I have cleared the level data for ${name}.`);
      return;
    }

    if (data === "activity") {
      const activity = await ActivityModel.findOne({ userId: target });
      if (activity) {
        await activity.delete();
        name = activity.userId;
      }
      await message.reply(`I have cleared the activity data for ${name}.`);
      return;
      return;
    }

    if (data === "stars") {
      const stars = await StarModel.find({});
      for (const datum of stars) {
        const index = datum.users.findIndex((u) => u.userID === target);
        if (index !== -1) {
          name = datum.users[index].userTag;
          datum.users.splice(index, 1);
          datum.markModified("users");
          await datum.save();
        }
      }
      await message.reply(`I have cleared the star data for ${name}.`);
      return;
    }

    if (data === "currency") {
      const currency = await CurrencyModel.findOne({ userId: target });
      if (currency) {
        name = currency.userId;
        await currency.delete();
      }
      await message.reply(`I have cleared the currency data for ${name}.`);
      return;
    }

    if (data === "votes") {
      const votes = await VoterModel.findOne({ userId: target });
      if (votes) {
        name = votes.userId;
        await votes.delete();
      }
      await message.reply(`I have cleared the vote data for ${name}.`);
      return;
    }

    if (data === "commands") {
      const commands = await CommandCountModel.findOne({ serverId: target });
      if (commands) {
        name = commands.serverName;
        await commands.delete();
      }
      await message.reply(`I have cleared the command data for ${name}.`);
      return;
    }

    if (data === "emotes") {
      const emotes = await EmoteCountModel.findOne({ userId: target });
      if (emotes) {
        name = emotes.userName;
        await emotes.delete();
      }
      await message.reply(`I have cleared the emote data for ${name}.`);
      return;
    }

    await message.reply(`${data} is not a valid option.`);
    return;
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "purge command",
      err,
      message.guild?.name,
      message
    );
  }
};
