import { Guild, MessageEmbed, TextChannel } from "discord.js";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { LogSettings } from "../../interfaces/settings/LogSettings";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { getSettings } from "../settings/getSettings";

/**
 * Validates that the server has set a log channel, confirms the channel still exists,
 * and sends the provided content embed to that channel.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {Guild} guild The guild object.
 * @param {MessageEmbed} content The MessageEmbed to send to the log channel.
 * @param {LogSettings} channel The log channel option to look for.
 */
export const sendLogEmbed = async (
  Becca: BeccaLyria,
  guild: Guild,
  content: MessageEmbed,
  channel: LogSettings
): Promise<void> => {
  try {
    const guildChannelSetting = (
      await getSettings(Becca, guild.id, guild.name)
    )?.[channel];

    if (!guildChannelSetting) {
      return;
    }

    const logsChannel = guild.channels.cache.find(
      (chan) => chan.id === guildChannelSetting && chan.type === "GUILD_TEXT"
    ) as TextChannel | undefined;

    if (!logsChannel) {
      return;
    }

    await logsChannel.send({ embeds: [content] });
  } catch (err) {
    beccaErrorHandler(Becca, "send log embed module", err, guild.name);
  }
};
