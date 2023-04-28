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

      const record = await Becca.db.messagecounts.upsert({
        where: {
          serverId_userId: {
            serverId: guild.id,
            userId: author.id,
          },
        },
        update: {},
        create: {
          serverId: guild.id,
          userId: author.id,
          messages: 0,
        },
      });

      record.messages += 1;

      await Becca.db.messagecounts.update({
        where: {
          serverId_userId: {
            serverId: guild.id,
            userId: author.id,
          },
        },
        data: record,
      });
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
