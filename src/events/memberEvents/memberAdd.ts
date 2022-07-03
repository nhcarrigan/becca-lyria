import { GuildMember, MessageEmbed, PartialGuildMember } from "discord.js";
import { getFixedT } from "i18next";

import { defaultServer } from "../../config/database/defaultServer";
import LevelModel from "../../database/models/LevelModel";
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
    const { user, guild } = member;

    if (!user) {
      return;
    }
    const lang = guild.preferredLocale;
    const t = getFixedT(lang);

    const serverSettings = await getSettings(Becca, guild.id, guild.name);

    if (member.pending) {
      // logic for pending members
      const partialJoinEmbed = new MessageEmbed();
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

    const welcomeText = (
      serverSettings?.custom_welcome || defaultServer.custom_welcome
    )
      .replace(/{@username}/gi, user.username)
      .replace(/{@servername}/gi, guild.name);

    const welcomeEmbed = new MessageEmbed();
    welcomeEmbed.setColor(Becca.colours.default);
    welcomeEmbed.setTitle(t("events:member.join.title"));
    welcomeEmbed.setDescription(welcomeText);
    welcomeEmbed.setAuthor({
      name: user.tag,
      iconURL: user.displayAvatarURL(),
    });
    welcomeEmbed.setFooter(`ID: ${user.id}`);
    welcomeEmbed.setTimestamp();

    await sendWelcomeEmbed(Becca, guild, "join", welcomeEmbed);

    if (serverSettings?.join_role) {
      const joinRole = await guild.roles.fetch(serverSettings.join_role);
      if (joinRole) {
        await member.roles.add(joinRole);
      }
    }

    if (serverSettings?.initial_xp && serverSettings?.levels === "on") {
      const userRecord =
        (await LevelModel.findOne({ serverID: guild.id, userID: member.id })) ||
        (await LevelModel.create({
          serverID: guild.id,
          serverName: guild.name,
          userID: member.id,
          userTag: user.tag,
          avatar: user.displayAvatarURL(),
          points: 0,
          level: 0,
          lastSeen: new Date(Date.now()),
          cooldown: 0,
        }));

      userRecord.points += parseInt(serverSettings.initial_xp);
      await userRecord.save();
    }

    Becca.pm2.metrics.users.set(Becca.pm2.metrics.users.val() + 1);
    Becca.pm2.metrics.events.mark();
  } catch (err) {
    await beccaErrorHandler(Becca, "member add event", err, member.guild.name);
  }
};
