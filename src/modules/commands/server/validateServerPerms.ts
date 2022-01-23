import { GuildMember, MessageEmbed, TextBasedChannel } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Validates that Becca has the expected guild-level permissions.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {TFunction} t The i18n function.
 * @param {GuildMember} BeccaMember Becca's guild member object for that server.
 * @param {TextBasedChannel} channel The channel to send the result to.
 * @returns {boolean} True if Becca has ALL required permissions, false otherwise.
 */
export const validateServerPerms = async (
  Becca: BeccaLyria,
  t: TFunction,
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
    permissionEmbed.setTitle(t("commands:misc.permissions.guild.title"));
    permissionEmbed.setDescription(
      t("commands:misc.permissions.guild.description")
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
