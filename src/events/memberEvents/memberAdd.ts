import { GuildMember, EmbedBuilder, PartialGuildMember } from "discord.js";
import { getFixedT } from "i18next";

import { defaultServer } from "../../config/database/defaultServer";
import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { sendLogEmbed } from "../../modules/guild/sendLogEmbed";
import { sendWelcomeEmbed } from "../../modules/guild/sendWelcomeEmbed";
import { getSettings } from "../../modules/settings/getSettings";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Handles the guildMemberAdd event. Checks if the member has passed screening,
 * handles the role onjoin logic, and sends the welcome message or pending notice.
 * Also handles assigning the initial experience points.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {GuildMember | PartialGuildMember} member Member object that represents user who joined.
 */
export const memberAdd = async (
  Becca: BeccaLyria,
  member: GuildMember | PartialGuildMember
): Promise<void> => {
  try {
    await Becca.analytics.updateEventCount("memberAdd");
    const { user, guild } = member;

    if (!user) {
      return;
    }
    const lang = guild.preferredLocale;
    const t = getFixedT(lang);

    const serverSettings = await getSettings(Becca, guild.id, guild.name);

    if (member.pending) {
      // logic for pending members
      if (serverSettings?.welcome_style === "embed") {
        const partialJoinEmbed = new EmbedBuilder();
        partialJoinEmbed.setColor(Becca.colours.warning);
        partialJoinEmbed.setTitle(t("events:member.pending.title"));
        partialJoinEmbed.setDescription(t("events:member.pending.desc"));
        partialJoinEmbed.setAuthor({
          name: user.tag,
          iconURL: user.displayAvatarURL(),
        });
        await sendLogEmbed(Becca, guild, partialJoinEmbed, "member_events");
        return;
      }
      if (serverSettings?.welcome_style === "text") {
        const channel =
          guild.channels.cache.get(serverSettings.welcome_channel) ||
          (await guild.channels.fetch(serverSettings.welcome_channel));
        if (channel && "send" in channel) {
          await channel.send({
            content: t("events:member.pending.desc"),
          });
        }
      }
    }

    const welcomeText = (
      serverSettings?.custom_welcome || defaultServer.custom_welcome
    )
      .replace(/{@username}/gi, user.username)
      .replace(/{@servername}/gi, guild.name);

    if (serverSettings?.welcome_style === "embed") {
      const welcomeEmbed = new EmbedBuilder();
      welcomeEmbed.setColor(Becca.colours.default);
      welcomeEmbed.setTitle(t("events:member.join.title"));
      welcomeEmbed.setDescription(welcomeText);
      welcomeEmbed.setAuthor({
        name: user.tag,
        iconURL: user.displayAvatarURL(),
      });
      welcomeEmbed.setFooter({ text: `ID: ${user.id}` });
      welcomeEmbed.setTimestamp();

      await sendWelcomeEmbed(Becca, guild, "join", welcomeEmbed);
    } else if (serverSettings?.welcome_style === "text") {
      const channel =
        guild.channels.cache.get(serverSettings.welcome_channel) ||
        (await guild.channels.fetch(serverSettings.welcome_channel));
      if (channel && "send" in channel) {
        await channel.send({
          content: welcomeText,
          allowedMentions: {},
        });
      }
    }

    if (serverSettings?.join_role) {
      const joinRole = await guild.roles.fetch(serverSettings.join_role);
      if (joinRole) {
        await member.roles.add(joinRole);
      }
    }

    if (serverSettings?.initial_xp && serverSettings?.levels === "on") {
      await Becca.db.newlevels.upsert({
        where: {
          serverID_userID: {
            serverID: guild.id,
            userID: member.id,
          },
        },
        update: {},
        create: {
          serverID: guild.id,
          serverName: guild.name,
          userID: member.id,
          userTag: user.tag,
          avatar: user.displayAvatarURL(),
          points: parseInt(serverSettings.initial_xp),
          level: 0,
          lastSeen: new Date(Date.now()),
          cooldown: 0,
        },
      });
    }
  } catch (err) {
    await beccaErrorHandler(Becca, "member add event", err, member.guild.name);
  }
};
