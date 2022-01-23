import { GuildMember, MessageEmbed, TextBasedChannel } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Validates that Becca has the expected channel-level permissions.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {TFunction} t The i18n function.
 * @param {GuildMember} BeccaMember Becca's guild member object for that server.
 * @param {TextBasedChannel} channel The channel to check permissions on.
 * @returns {boolean} True if Becca has ALL required permissions, false otherwise.
 */
export const validateChannelPerms = async (
  Becca: BeccaLyria,
  t: TFunction,
  BeccaMember: GuildMember,
  channel: TextBasedChannel
): Promise<boolean> => {
  try {
    const manageServer = BeccaMember.permissionsIn(channel.id).has(
      "MANAGE_GUILD"
    );
    const manageRoles = BeccaMember.permissionsIn(channel.id).has(
      "MANAGE_ROLES"
    );
    const manageChannels = BeccaMember.permissionsIn(channel.id).has(
      "MANAGE_CHANNELS"
    );
    const kickMembers = BeccaMember.permissionsIn(channel.id).has(
      "KICK_MEMBERS"
    );
    const banMembers = BeccaMember.permissionsIn(channel.id).has("BAN_MEMBERS");
    const sendMessages = BeccaMember.permissionsIn(channel.id).has(
      "SEND_MESSAGES"
    );
    const manageMessages = BeccaMember.permissionsIn(channel.id).has(
      "MANAGE_MESSAGES"
    );
    const embedLinks = BeccaMember.permissionsIn(channel.id).has("EMBED_LINKS");
    const attachFiles = BeccaMember.permissionsIn(channel.id).has(
      "ATTACH_FILES"
    );
    const readMessageHistory = BeccaMember.permissionsIn(channel.id).has(
      "READ_MESSAGE_HISTORY"
    );
    const addReactions = BeccaMember.permissionsIn(channel.id).has(
      "ADD_REACTIONS"
    );
    const useEmotes = BeccaMember.permissionsIn(channel.id).has(
      "USE_EXTERNAL_EMOJIS"
    );
    const manageNicknames = BeccaMember.permissionsIn(channel.id).has(
      "MANAGE_NICKNAMES"
    );
    const moderateMembers = BeccaMember.permissionsIn(channel.id).has(
      "MODERATE_MEMBERS"
    );
    const viewChannel = BeccaMember.permissionsIn(channel.id).has(
      "VIEW_CHANNEL"
    );
    const readMessages = BeccaMember.permissionsIn(channel.id).has(
      "READ_MESSAGE_HISTORY"
    );

    const permissionEmbed = new MessageEmbed();
    permissionEmbed.setTitle(t("commands:misc.permissions.channel.title"));
    permissionEmbed.setDescription(
      t("commands:misc.permissions.channel.description")
    );
    permissionEmbed.addFields([
      {
        name: t("commands:misc.permissions.names.server"),
        value: `${manageServer}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.roles"),
        value: `${manageRoles}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.channels"),
        value: `${manageChannels}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.kick"),
        value: `${kickMembers}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.ban"),
        value: `${banMembers}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.send"),
        value: `${sendMessages}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.message"),
        value: `${manageMessages}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.embed"),
        value: `${embedLinks}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.attach"),
        value: `${attachFiles}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.history"),
        value: `${readMessageHistory}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.react"),
        value: `${addReactions}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.emote"),
        value: `${useEmotes}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.nick"),
        value: `${manageNicknames}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.mod"),
        value: `${moderateMembers}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.view"),
        value: `${viewChannel}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.read"),
        value: `${readMessages}`,
        inline: true,
      },
    ]);
    permissionEmbed.setColor(Becca.colours.default);
    permissionEmbed.setTimestamp();
    permissionEmbed.setFooter(`ID: ${channel.id}`);

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
    await beccaErrorHandler(Becca, "validate channel perms module", err);
    return false;
  }
};
