import { Guild, EmbedBuilder } from "discord.js";

import CommandCountModel from "../../database/models/CommandCountModel";
import HistoryModel from "../../database/models/HistoryModel";
import LevelModel from "../../database/models/LevelModel";
import ServerModel from "../../database/models/ServerConfigModel";
import StarModel from "../../database/models/StarModel";
import { BeccaLyria } from "../../interfaces/BeccaLyria";

/**
 * Sends a notification to the debug hook when Becca leaves a server. Also cleans up
 * the stored data for that server.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {Guild} guild The guild object representing the server Becca was removed from.
 */
export const guildDelete = async (
  Becca: BeccaLyria,
  guild: Guild
): Promise<void> => {
  const owner = await guild.members.fetch(guild.ownerId).catch(() => null);
  const guildDeleteEmbed = new EmbedBuilder();
  guildDeleteEmbed.setTitle(
    `${Becca.user?.username || "Becca Lyria"} has been dismissed from a guild!`
  );
  guildDeleteEmbed.setDescription(
    "It would seem they no longer need my assistance."
  );
  guildDeleteEmbed.addFields([
    {
      name: "Guild Name",
      value: guild.name,
      inline: true,
    },
    {
      name: "Guild Owner",
      value: owner?.user.username || "No owner data available.",
      inline: true,
    },
    {
      name: "Guild ID",
      value: guild.id,
      inline: true,
    },
    {
      name: "Guild Owner ID",
      value: guild.ownerId || "No owner data available",
      inline: true,
    },
  ]);

  guildDeleteEmbed.setColor(Becca.colours.warning);
  guildDeleteEmbed.setTimestamp();

  await Becca.debugHook.send({ embeds: [guildDeleteEmbed] });

  await ServerModel.findOneAndDelete({ serverID: guild.id });
  await LevelModel.deleteMany({ serverID: guild.id });
  await StarModel.findOneAndDelete({ serverID: guild.id });
  await CommandCountModel.findOneAndDelete({ serverId: guild.id });
  await HistoryModel.deleteMany({ serverId: guild.id });

  Becca.pm2.metrics.guilds.set(Becca.pm2.metrics.guilds.val() - 1);
  Becca.pm2.metrics.events.mark();
};
