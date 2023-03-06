import MessageCountModel from "../database/models/MessageCountModel";
import { Listener } from "../interfaces/listeners/Listener";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const messageCountListener: Listener = {
  name: "Count Messages",
  description: "Counts the number of messages a user sends in a server.",
  run: async (Becca, message) => {
    try {
      const { author, guild } = message;

      if (!guild) {
        return;
      }

      const record =
        (await MessageCountModel.findOne({
          serverId: guild.id,
          userId: author.id,
        })) ||
        (await MessageCountModel.create({
          serverId: guild.id,
          userId: author.id,
          messages: 0,
        }));

      record.messages += 1;
      await record.save();
    } catch (err) {
      await beccaErrorHandler(
        Becca,
        "message count listener",
        err,
        message.guild?.name,
        message
      );
    }
  },
};
