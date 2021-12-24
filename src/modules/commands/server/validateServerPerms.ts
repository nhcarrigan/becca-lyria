import { GuildMember, MessageEmbed, TextBasedChannel } from "discord.js";

import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Validates that Becca has the expected guild-level permissions.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {GuildMember} BeccaMember Becca's guild member object for that server.
 * @param {TextBasedChannel} channel The channel to send the result to.
 * @returns {boolean} True if Becca has ALL required permissions, false otherwise.
 */
export const validateServerPerms = async (
  Becca: BeccaLyria,
  BeccaMember: GuildMember,
  channel: TextBasedChannel
): Promise<boolean> => {
  try {
    const manageServer = BeccaMember.permissions.has("MANAGE_GUILD");
    const manageRoles = BeccaMember.permissions.has("MANAGE_ROLES");
    const manageChannels = BeccaMember.permissions.has("MANAGE_CHANNELS");
    const kickMembers = BeccaMember.permissions.has("KICK_MEMBERS");
    const banMembers = BeccaMember.permissions.has("BAN_MEMBERS");
    const sendMessages = BeccaMember.permissions.has("SEND_MESSAGES");
    const manageMessages = BeccaMember.permissions.has("MANAGE_MESSAGES");
    const embedLinks = BeccaMember.permissions.has("EMBED_LINKS");
    const attachFiles = BeccaMember.permissions.has("ATTACH_FILES");
    const readMessageHistory = BeccaMember.permissions.has(
      "READ_MESSAGE_HISTORY"
    );
    const addReactions = BeccaMember.permissions.has("ADD_REACTIONS");
    const useEmotes = BeccaMember.permissions.has("USE_EXTERNAL_EMOJIS");
    const manageNicknames = BeccaMember.permissions.has("MANAGE_NICKNAMES");
    const moderateMembers = BeccaMember.permissions.has("MODERATE_MEMBERS");
    const viewChannel = BeccaMember.permissions.has("VIEW_CHANNEL");
    const readMessages = BeccaMember.permissions.has("READ_MESSAGE_HISTORY");

    const permissionEmbed = new MessageEmbed();
    permissionEmbed.setTitle("Guild Permissions");
    permissionEmbed.setDescription(
      `Here are the permissions I have in ${BeccaMember.guild.name}.`
    );
    permissionEmbed.addFields([
      { name: "Manage Server", value: `${manageServer}`, inline: true },
      { name: "Manage Roles", value: `${manageRoles}`, inline: true },
      { name: "Manage Channels", value: `${manageChannels}`, inline: true },
      { name: "Kick Members", value: `${kickMembers}`, inline: true },
      { name: "Ban Members", value: `${banMembers}`, inline: true },
      { name: "Send Messages", value: `${sendMessages}`, inline: true },
      { name: "Manage Messages", value: `${manageMessages}`, inline: true },
      { name: "Embed Links", value: `${embedLinks}`, inline: true },
      { name: "Attach Files", value: `${attachFiles}`, inline: true },
      {
        name: "Read Message History",
        value: `${readMessageHistory}`,
        inline: true,
      },
      { name: "Add Reactions", value: `${addReactions}`, inline: true },
      { name: "Use Emotes", value: `${useEmotes}`, inline: true },
      { name: "Manage Nicknames", value: `${manageNicknames}`, inline: true },
      { name: "Moderate Members", value: `${moderateMembers}`, inline: true },
      { name: "View Channel", value: `${viewChannel}`, inline: true },
      { name: "Read Messages", value: `${readMessages}`, inline: true },
    ]);
    permissionEmbed.setColor(Becca.colours.default);
    permissionEmbed.setTimestamp();
    permissionEmbed.setFooter(`ID: ${BeccaMember.guild.id}`);

    await channel.send({ embeds: [permissionEmbed] });

    return (
      manageServer &&
      manageRoles &&
      manageChannels &&
      kickMembers &&
      banMembers &&
      sendMessages &&
      manageMessages &&
      embedLinks &&
      attachFiles &&
      readMessageHistory &&
      addReactions &&
      useEmotes &&
      manageNicknames &&
      moderateMembers &&
      viewChannel &&
      readMessages
    );
  } catch (err) {
    await beccaErrorHandler(Becca, "validate server perms module", err);
    return false;
  }
};
