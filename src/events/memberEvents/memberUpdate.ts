import { GuildMember, MessageEmbed, PartialGuildMember } from "discord.js";
import { getFixedT } from "i18next";

import { defaultServer } from "../../config/database/defaultServer";
import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { sendWelcomeEmbed } from "../../modules/guild/sendWelcomeEmbed";
import { getSettings } from "../../modules/settings/getSettings";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Handles the memberUpdate event. Currently checks to see if
 * member has passed screening event, and if so, sends welcome embed.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {GuildMember | PartialGuildMember} oldMember The member's state before the update.
 * @param {GuildMember} newMember The member's state after the update.
 */
export const memberUpdate = async (
  Becca: BeccaLyria,
  oldMember: GuildMember | PartialGuildMember,
  newMember: GuildMember
): Promise<void> => {
  try {
    const { guild, user } = newMember;
    const lang = guild.preferredLocale;
    const t = getFixedT(lang);

    // passes membership screening
    if (oldMember.pending && !newMember.pending) {
      const serverSettings = await getSettings(Becca, guild.id, guild.name);
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
          await newMember.roles.add(joinRole);
        }
      }
    }
    Becca.pm2.metrics.events.mark();
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "member remove event",
      err,
      newMember.guild.name
    );
  }
};
