import { BeccaCounts } from "../../interfaces/becca/BeccaCounts";
import { BeccaLyria } from "../../interfaces/BeccaLyria";

/**
 * Aggregates Becca's guild count, member counts, and
 * command counts.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @returns {BeccaCounts} An object representing the aggregated counts.
 */
export const getCounts = (Becca: BeccaLyria): BeccaCounts => {
  const guildCount = Becca.guilds.cache.size;
  let memberCount = 0;
  let commandCount = 0;

  Becca.guilds.cache.forEach((guild) => {
    memberCount += guild.memberCount;
  });

  Becca.commands.forEach((command) => {
    const parsed = command.data.toJSON().options;
    if (!parsed) {
      return;
    }
    parsed.forEach((option) => {
      // subcommands are type 1
      if (option.type === 1) {
        commandCount++;
      }
    });
  });

  commandCount += Becca.contexts.length;

  return {
    commands: commandCount,
    guilds: guildCount,
    members: memberCount,
  };
};
