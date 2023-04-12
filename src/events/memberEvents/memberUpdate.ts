import {
  GuildMember,
  EmbedBuilder,
  PartialGuildMember,
  PermissionFlagsBits,
} from "discord.js";
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
    const serverSettings = await getSettings(Becca, guild.id, guild.name);

    if (!serverSettings) {
      return;
    }

    // passes membership screening
    if (oldMember.pending && !newMember.pending) {
      const welcomeText = (
        serverSettings.custom_welcome || defaultServer.custom_welcome
      )
        .replace(/{@username}/gi, user.username)
        .replace(/{@servername}/gi, guild.name);

      if (serverSettings.welcome_style === "embed") {
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
      } else if (serverSettings.welcome_style === "text") {
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
          await newMember.roles.add(joinRole);
        }
      }
    }

    if (!serverSettings.member_events) {
      return;
    }

    const logChannel = await guild.channels.fetch(serverSettings.member_events);
    const beccaMember = guild.members.cache.get(Becca.user?.id || "");

    if (
      !logChannel ||
      !("send" in logChannel) ||
      !beccaMember
        ?.permissionsIn(logChannel)
        .has(PermissionFlagsBits.SendMessages)
    ) {
      return;
    }

    const embed = new EmbedBuilder();
    embed.setColor(Becca.colours.default);
    embed.setTitle(t("events:member.update.title"));
    embed.setAuthor({
      name: user.tag,
      iconURL: user.displayAvatarURL(),
    });
    embed.setFooter({ text: `ID: ${user.id}` });
    embed.setTimestamp();

    if (oldMember.nickname !== newMember.nickname) {
      embed.setDescription(
        t("events:member.update.description", {
          key: "nickname",
        })
      );
      embed.addFields([
        {
          name: t("events:member.update.old"),
          value: oldMember.nickname || oldMember.user.username,
          inline: true,
        },
        {
          name: t("events:member.update.new"),
          value: newMember.nickname || newMember.user.username,
          inline: true,
        },
      ]);

      await logChannel.send({ embeds: [embed] });
    }

    if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
      embed.setDescription(
        t("events:member.update.description", {
          key: "roles",
        })
      );

      const addedRoles = newMember.roles.cache
        .filter((role) => !oldMember.roles.cache.has(role.id))
        .map((role) => `<@&${role.id}>`);
      const removedRoles = oldMember.roles.cache
        .filter((role) => !newMember.roles.cache.has(role.id))
        .map((role) => `<@&${role.id}>`);

      embed.addFields([
        {
          name: t("events:member.update.old"),
          value: removedRoles.join(", ") || "No roles removed.",
          inline: true,
        },
        {
          name: t("events:member.update.new"),
          value: addedRoles.join(", ") || "No roles added.",
          inline: true,
        },
      ]);

      await logChannel.send({ embeds: [embed] });
    }
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "member update event",
      err,
      newMember.guild.name
    );
  }
};
