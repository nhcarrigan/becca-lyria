import {
  Guild,
  GuildBasedChannel,
  GuildMember,
  Message,
  Role,
  TextBasedChannel,
} from "discord.js";

import { BeccaLyria } from "../interfaces/BeccaLyria";

/**
 * Wraps Discord fetch calls to handle errors.
 */
export class FetchWrapper {
  /**
   * Fetches a guild from Becca's guilds.
   *
   * @param {BeccaLyria} Becca Becca's Discord instance.
   * @param {string} guildId The ID of the guild to fetch.
   * @returns {Promise<Guild | null>} The guild, or null on error.
   * @async
   */
  public static async guild(
    Becca: BeccaLyria,
    guildId: string
  ): Promise<Guild | null> {
    const guild =
      Becca.guilds.cache.get(guildId) ||
      (await Becca.guilds.fetch(guildId).catch(() => null));
    return guild;
  }

  /**
   * Fetches a channel from a guild.
   *
   * @param {Guild} guild The guild to fetch from.
   * @param {string} channelId The ID of the channel to fetch.
   * @returns {Promise<GuildBasedChannel | null>} The channel, or null on error.
   * @async
   */
  public static async channel(
    guild: Guild | null,
    channelId: string
  ): Promise<GuildBasedChannel | null> {
    const channel =
      guild?.channels.cache.get(channelId) ||
      (await guild?.channels.fetch(channelId).catch(() => null)) ||
      null;
    return channel;
  }

  /**
   * Fetches a member from the guild.
   *
   * @param {Guild | null} guild The guild to fetch from.
   * @param {string} memberId The ID of the member to fetch.
   * @returns {Promise<GuildMember | null>} The member, or null on error.
   * @async
   */
  public static async member(
    guild: Guild | null,
    memberId: string
  ): Promise<GuildMember | null> {
    const member =
      guild?.members.cache.get(memberId) ||
      (await guild?.members.fetch(memberId).catch(() => null)) ||
      null;
    return member;
  }

  /**
   * Fetches Becca from the guild.
   *
   * @param {BeccaLyria} Becca Becca's Discord instance.
   * @param {Guild} guild The guild to fetch from.
   * @returns {Promise<GuildMember | null>} The guild, or null on error.
   * @async
   */
  public static async becca(
    Becca: BeccaLyria,
    guild: Guild | null
  ): Promise<GuildMember | null> {
    if (!Becca.user?.id) {
      return null;
    }
    const me =
      guild?.members.cache.get(Becca.user.id) ||
      (await guild?.members.fetch(Becca.user.id).catch(() => null)) ||
      null;
    return me;
  }

  /**
   * Fetches a message from a channel.
   *
   * @param {TextBasedChannel | null} channel The channel to fetch from.
   * @param {string} messageId The ID of the message to fetch.
   * @returns {Promise<Message | null>} The message, or null on error.
   * @async
   */
  public static async message(
    channel: TextBasedChannel | null,
    messageId: string
  ): Promise<Message | null> {
    const message =
      channel?.messages.cache.get(messageId) ||
      (await channel?.messages.fetch(messageId).catch(() => null)) ||
      null;
    return message;
  }

  /**
   * Fetches a role from a guild.
   *
   * @param {Guild | null} guild The guild to fetch from.
   * @param {string} roleId The ID of the role to fetch.
   * @returns {Promise<Role | null>} The role, or null on error.
   * @async
   */
  public static async role(
    guild: Guild | null,
    roleId: string
  ): Promise<Role | null> {
    const role =
      guild?.roles.cache.get(roleId) ||
      (await guild?.roles.fetch(roleId).catch(() => null)) ||
      null;
    return role;
  }
}
