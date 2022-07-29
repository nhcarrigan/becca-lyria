import { EmbedBuilder } from "discord.js";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { getCounts } from "../../modules/becca/getCounts";
import { beccaLogHandler } from "../../utils/beccaLogHandler";

/**
 * Sends a notification to the debug hook when Becca has connected to
 * Discord and is ready to receive events.
 *
 * @param {BeccaLyria} Becca Becca's Client instance.
 */
export const ready = async (Becca: BeccaLyria): Promise<void> => {
  beccaLogHandler.log("debug", "Fetching reaction role data...");
  const readyEmbed = new EmbedBuilder();
  readyEmbed.setTitle("Becca is online");
  readyEmbed.setDescription(
    `${Becca.user?.username || "Becca Lyria"} has come online.`
  );
  readyEmbed.setTimestamp();
  readyEmbed.setColor(Becca.colours.success);
  readyEmbed.setFooter({ text: `Version ${Becca.configs.version}` });

  await Becca.debugHook.send({ embeds: [readyEmbed] });
  beccaLogHandler.log("debug", "Discord ready!");

  const counts = getCounts(Becca);
  Becca.pm2.metrics.guilds.set(counts.guilds);
  Becca.pm2.metrics.users.set(counts.members);

  beccaLogHandler.log("debug", "Loaded PM2 counts!");
  Becca.pm2.metrics.events.mark();
};
