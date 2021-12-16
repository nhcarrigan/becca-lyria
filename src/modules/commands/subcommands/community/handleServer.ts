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
export const handleServer: CommandHandler = async (Becca, interaction) => {
  try {
    const { guild } = interaction;

    if (!guild) {
      await interaction.editReply({
        content: getRandomValue(Becca.responses.missingGuild),
      });
      return;
    }

    const guildOwner = await guild.members.fetch(guild.ownerId);
    const guildMembers = (await guild.members.fetch()).map((u) => u);
    const guildBans = await guild.bans.fetch();
    const guildChannels = guild.channels.cache;
    const guildEmojis = guild.emojis.cache;
    const guildMfa = guild.mfaLevel
      ? "Moderators require MFA"
      : "Moderators do not require MFA";

    const serverEmbed = new MessageEmbed();
    serverEmbed.setColor(Becca.colours.default);
    serverEmbed.setTitle(guild.name);
    serverEmbed.setDescription(
      guild.description || "This guild does not have a description yet."
    );
    serverEmbed.setThumbnail(guild.iconURL({ dynamic: true }) || "");
    serverEmbed.addField(
      "Creation Date",
      new Date(guild.createdTimestamp).toLocaleDateString(),
      true
    );
    serverEmbed.addField("Owner", guildOwner.toString(), true);
    serverEmbed.addField("Members", guild.memberCount.toString(), true);
    serverEmbed.addField(
      "Living Members",
      guildMembers.filter((member) => !member.user.bot).length.toString(),
      true
    );
    serverEmbed.addField(
      "Robot Members",
      guildMembers.filter((member) => member.user.bot).length.toString(),
      true
    );
    serverEmbed.addField("Banished Members", guildBans.size.toString(), true);
    serverEmbed.addField("\u200b", "\u200b", true);
    serverEmbed.addField("Titles", guild.roles.cache.size.toString(), true);
    serverEmbed.addField("Channels", guildChannels.size.toString(), true);
    serverEmbed.addField(
      "Text Channels",
      guildChannels
        .filter((chan) => chan.type === "GUILD_TEXT")
        .size.toString(),
      true
    );
    serverEmbed.addField(
      "Voice Channels",
      guildChannels
        .filter((chan) => chan.type === "GUILD_VOICE")
        .size.toString(),
      true
    );
    serverEmbed.addField(
      "Boosts",
      `Level ${guild.premiumTier} with ${guild.premiumSubscriptionCount} boosts.`,
      true
    );
    serverEmbed.addField(
      "Static Emoji",
      guildEmojis.filter((emote) => !emote.animated).size.toString(),
      true
    );
    serverEmbed.addField(
      "Animated Emoji",
      guildEmojis.filter((emote) => !!emote.animated).size.toString(),
      true
    );
    serverEmbed.addField(
      "Content Filter",
      contentFilterMap[guild.explicitContentFilter],
      true
    );
    serverEmbed.addField("Authentication Level", guildMfa, true);
    serverEmbed.addField(
      "Account Verification Requirement",
      accountVerificationMap[guild.verificationLevel],
      true
    );
    serverEmbed.addField(
      "Statuses",
      `**Partnered?** \`${guild.partnered}\`\n**Verified?** \`${guild.verified}\``,
      true
    );
    serverEmbed.addField(
      "Special channels",
      `**System Channel:** \`${
        guild.systemChannel?.name || "no"
      }\` \n**Rules Channel:** \`${
        guild.rulesChannel?.name || "nope"
      }\`\n**Public Channel:** \`${guild.publicUpdatesChannel?.name || "no"}\``,
      true
    );
    serverEmbed.setFooter(
      "Like the bot? Donate: https://donate.nhcarrigan.com"
    );

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
