import { GuildMember, MessageEmbed, PartialGuildMember } from "discord.js";
import { defaultServer } from "../../config/database/defaultServer";
import ServerModel from "../../database/models/ServerModel";
import { BeccaInt } from "../../interfaces/BeccaInt";
import { sendWelcomeEmbed } from "../../modules/guild/sendWelcomeEmbed";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Handles the guildMemberRemove event. Constructs an embed and passes it to the
 * welcome channel.
 * @param Becca Becca's Client instance
 * @param member object representing the user who left the server
 */
export const memberRemove = async (
  Becca: BeccaInt,
  member: GuildMember | PartialGuildMember
): Promise<void> => {
  try {
    const { user, guild, nickname, roles } = member;

    if (!user) {
      return;
    }

    const roleList = roles.cache.map((el) => el);

    const serverConfig = await ServerModel.findOne({ serverID: guild.id });

    const goodbyeEmbed = new MessageEmbed();
    goodbyeEmbed.setTitle("A member has abandoned our guild.");
    goodbyeEmbed.setColor(Becca.colours.default);
    goodbyeEmbed.setDescription(
      (serverConfig?.leave_message || defaultServer.leave_message)
        .replace(/\{@username\}/g, `<@!${member.user.tag}>`)
        .replace(/\{@servername\}/g, guild.name)
    );
    goodbyeEmbed.addField("Name", nickname || user.username);
    goodbyeEmbed.addField("Roles", roleList.join("\n"));
    goodbyeEmbed.setAuthor(
      `${user.username}#${user.discriminator}`,
      user.displayAvatarURL()
    );
    goodbyeEmbed.setFooter(`ID: ${user.id}`);
    goodbyeEmbed.setTimestamp();

    await sendWelcomeEmbed(Becca, guild, goodbyeEmbed);
  } catch (err) {
    beccaErrorHandler(Becca, "member remove event", err, member.guild.name);
  }
};
