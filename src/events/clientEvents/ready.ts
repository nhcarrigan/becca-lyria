import { EmbedBuilder } from "discord.js";
import { scheduleJob } from "node-schedule";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { postDailyAnalytics } from "../../modules/analytics/postDailyAnalytics";
import { loadEvents } from "../../modules/events/scheduledEvent";
import { beccaLogHandler } from "../../utils/beccaLogHandler";

/**
 * Sends a notification to the debug hook when Becca has connected to
 * Discord and is ready to receive events.
 *
 * @param {BeccaLyria} Becca Becca's Client instance.
 */
export const ready = async (Becca: BeccaLyria): Promise<void> => {
  await Becca.analytics.updateEventCount("clientReady");
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

  await loadEvents(Becca);
  beccaLogHandler.log("debug", "Loaded scheduled events!");

  await postDailyAnalytics(Becca);
  // daily at midnight
  scheduleJob("0 0 * * *", async () => {
    await postDailyAnalytics(Becca);
  });
  beccaLogHandler.log("debug", "Loaded daily analytics!");
};
