import { Guild, MessageEmbed, TextChannel } from "discord.js";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { getSettings } from "../settings/getSettings";

/**
 * Validates that a server has set the custom welcome channel, that channel still
 * exists, and if so sends the given embed to that channel.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {Guild} guild The guild object.
 * @param {string} type The type of message to send, either `join` or `leave`.
 * @param {MessageEmbed} content The MessageEmbed to send to the log channel.
 */
export const sendWelcomeEmbed = async (
  Becca: BeccaLyria,
  guild: Guild,
  type: "join" | "leave",
  content: MessageEmbed
): Promise<void> => {
  try {
    const guildSettings = await getSettings(Becca, guild.id, guild.name);

    const guildChannelSetting =
      type === "join"
        ? guildSettings?.welcome_channel
        : guildSettings?.depart_channel;

    if (!guildChannelSetting) {
      return;
    }

    const targetChannel = guild.channels.cache.find(
      (chan) => chan.id === guildChannelSetting && chan.type === "GUILD_TEXT"
    ) as TextChannel | undefined;

    if (!targetChannel) {
      return;
    }

    await targetChannel.send({ embeds: [content] });
  } catch (err) {
    await beccaErrorHandler(Becca, "send log embed module", err, guild.name);
  }
};
