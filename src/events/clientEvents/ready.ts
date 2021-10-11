import { MessageEmbed } from "discord.js";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaLogHandler } from "../../utils/beccaLogHandler";

/**
 * Sends a notification to the debug hook when Becca has connected to
 * Discord and is ready to receive events.
 *
 * @param {BeccaLyria} Becca Becca's Client instance.
 */
export const ready = async (Becca: BeccaLyria): Promise<void> => {
  const readyEmbed = new MessageEmbed();
  readyEmbed.setTitle("Becca is online");
  readyEmbed.setDescription(
    `${Becca.user?.username || "Becca Lyria"} has come online.`
  );
  readyEmbed.setTimestamp();
  readyEmbed.setColor(Becca.colours.success);
  readyEmbed.setFooter(`Version ${Becca.configs.version}`);

  await Becca.debugHook.send({ embeds: [readyEmbed] });
  beccaLogHandler.log("debug", "Discord ready!");
};
