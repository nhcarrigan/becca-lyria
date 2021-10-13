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
 * @param {MessageEmbed} content The MessageEmbed to send to the log channel.
 */
export const sendWelcomeEmbed = async (
  Becca: BeccaLyria,
  guild: Guild,
  content: MessageEmbed
): Promise<void> => {
  try {
    const guildChannelSetting = (await getSettings(Becca, guild.id, guild.name))
      ?.welcome_channel;

    if (!guildChannelSetting) {
      return;
    }

    const welcomeChannel = guild.channels.cache.find(
      (chan) => chan.id === guildChannelSetting && chan.type === "GUILD_TEXT"
    ) as TextChannel | undefined;

    if (!welcomeChannel) {
      return;
    }

    await welcomeChannel.send({ embeds: [content] });
  } catch (err) {
    await beccaErrorHandler(Becca, "send log embed module", err, guild.name);
  }
};
