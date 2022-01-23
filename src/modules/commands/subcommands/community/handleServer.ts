/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import {
  accountVerificationMap,
  contentFilterMap,
} from "../../../../config/commands/serverInfo";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Generates an embed listing the various Discord settings for the specific server.
 */
export const handleServer: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { guild } = interaction;

    if (!guild) {
      await interaction.editReply({
        content: getRandomValue(t("responses:missingGuild")),
      });
      return;
    }

    const guildOwner = await guild.members.fetch(guild.ownerId);
    const guildMembers = (await guild.members.fetch()).map((u) => u);
    const guildBans = await guild.bans.fetch();
    const guildChannels = guild.channels.cache;
    const guildEmojis = guild.emojis.cache;
    const guildMfa = guild.mfaLevel
      ? t("commands:community.server.mfa")
      : t("commands:community.server.nomfa");

    const serverEmbed = new MessageEmbed();
    serverEmbed.setColor(Becca.colours.default);
    serverEmbed.setTitle(guild.name);
    serverEmbed.setDescription(
      guild.description || t("commands:community.server.description")
    );
    serverEmbed.setThumbnail(guild.iconURL({ dynamic: true }) || "");
    serverEmbed.addField(
      t("commands:community.server.creation"),
      new Date(guild.createdTimestamp).toLocaleDateString(),
      true
    );
    serverEmbed.addField(
      t("commands:community.server.owner"),
      guildOwner.toString(),
      true
    );
    serverEmbed.addField(
      t("commands:community.server.members"),
      guild.memberCount.toString(),
      true
    );
    serverEmbed.addField(
      t("commands:community.server.living"),
      guildMembers.filter((member) => !member.user.bot).length.toString(),
      true
    );
    serverEmbed.addField(
      t("commands:community.server.bot"),
      guildMembers.filter((member) => member.user.bot).length.toString(),
      true
    );
    serverEmbed.addField(
      t("commands:community.server.ban"),
      guildBans.size.toString(),
      true
    );
    serverEmbed.addField("\u200b", "\u200b", true);
    serverEmbed.addField(
      t("commands:community.server.titles"),
      guild.roles.cache.size.toString(),
      true
    );
    serverEmbed.addField(
      t("commands:community.server.channels"),
      guildChannels.size.toString(),
      true
    );
    serverEmbed.addField(
      t("commands:community.server.text"),
      guildChannels
        .filter((chan) => chan.type === "GUILD_TEXT")
        .size.toString(),
      true
    );
    serverEmbed.addField(
      t("commands:community.server.voice"),
      guildChannels
        .filter((chan) => chan.type === "GUILD_VOICE")
        .size.toString(),
      true
    );
    serverEmbed.addField(
      t("commands:community.server.boost"),
      `Level ${guild.premiumTier} with ${guild.premiumSubscriptionCount} boosts.`,
      true
    );
    serverEmbed.addField(
      t("commands:community.server.semote"),
      guildEmojis.filter((emote) => !emote.animated).size.toString(),
      true
    );
    serverEmbed.addField(
      t("commands:community.server.aemote"),
      guildEmojis.filter((emote) => !!emote.animated).size.toString(),
      true
    );
    serverEmbed.addField(
      t("commands:community.server.content"),
      contentFilterMap[guild.explicitContentFilter],
      true
    );
    serverEmbed.addField(t("commands:community.server.auth"), guildMfa, true);
    serverEmbed.addField(
      t("commands:community.server.account"),
      accountVerificationMap[guild.verificationLevel],
      true
    );
    serverEmbed.addField(
      t("commands:community.server.status"),
      t("commands:community.server.statuses", {
        partnered: guild.partnered,
        verified: guild.verified,
      }),
      true
    );
    serverEmbed.addField(
      t("commands:community.server.special"),
      t("commands:community.server.schannels", {
        system: guild.systemChannel?.name || "null",
        rules: guild.rulesChannel?.name || "null",
        public: guild.publicUpdatesChannel?.name || "null",
      }),
      true
    );
    serverEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
    });

    await interaction.editReply({ embeds: [serverEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "server command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "server", errorId)],
    });
  }
};
