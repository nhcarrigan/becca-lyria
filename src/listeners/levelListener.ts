/* eslint-disable jsdoc/require-jsdoc */
import { ChannelType, EmbedBuilder, TextChannel } from "discord.js";

import levelScale from "../config/listeners/levelScale";
import LevelModel from "../database/models/LevelModel";
import { Listener } from "../interfaces/listeners/Listener";
import { generateLevelText } from "../modules/listeners/generateLevelText";
import { generateRoleText } from "../modules/listeners/generateRoleText";
import { getOptOutRecord } from "../modules/listeners/getOptOutRecord";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

/**
 * Confirms the server has enabled the level system, then awards
 * experience points to a user on message - with bonus points based
 * on message length. If the user has levelled up, sends a message to the
 * channel OR the configured level channel.
 *
 * Also assigns configured level-specific roles.
 */
export const levelListener: Listener = {
  name: "Level Up!",
  description: "Grants experience based on message activity in the server.",
  run: async (Becca, message, t, serverSettings) => {
    try {
      const { author, content, guild, member } = message;

      const optout = await getOptOutRecord(Becca, author.id);

      if (!optout || optout.level) {
        return;
      }

      if (!guild) {
        return;
      }

      if (serverSettings?.levels !== "on") {
        return;
      }

      if (serverSettings.level_ignore.includes(message.channel.id)) {
        return;
      }

      let targetChannel = message.channel as TextChannel;

      if (serverSettings.level_channel) {
        const realChannel = guild.channels.cache.find(
          (c) =>
            c.id === serverSettings.level_channel &&
            c.type === ChannelType.GuildText
        );
        if (realChannel) {
          targetChannel = realChannel as TextChannel;
        }
      }

      const bonus = Math.floor(content.length / 10);
      const pointsEarned = Math.floor(Math.random() * (20 + bonus)) + 5;
      const user =
        (await LevelModel.findOne({ serverID: guild.id, userID: author.id })) ||
        (await LevelModel.create({
          serverID: guild.id,
          serverName: guild.name,
          userID: author.id,
          userTag: author.tag,
          avatar: author.displayAvatarURL(),
          points: 0,
          level: 0,
          lastSeen: new Date(Date.now()),
          cooldown: 0,
        }));

      if (Date.now() - user.cooldown < 60000 || user.level >= 100) {
        return;
      }

      user.points += pointsEarned;
      user.lastSeen = new Date(Date.now());
      user.userTag = author.tag;
      user.avatar = author.displayAvatarURL();
      user.cooldown = Date.now();
      let levelUp = false;

      while (user.points > levelScale[user.level + 1]) {
        user.level++;
        levelUp = true;
      }

      await user.save();

      if (levelUp) {
        const content = serverSettings.level_message
          ? generateLevelText(serverSettings.level_message, author, user.level)
          : t<string, string>("listeners:level.desc", {
              user: `<@!${author.id}>`,
              level: user.level,
            });
        if (serverSettings.level_style === "embed") {
          const levelEmbed = new EmbedBuilder();
          levelEmbed.setTitle(t<string, string>("listeners:level.title"));
          levelEmbed.setDescription(content);
          levelEmbed.setColor(Becca.colours.default);
          levelEmbed.setAuthor({
            name: author.tag,
            iconURL: author.displayAvatarURL(),
          });
          levelEmbed.setFooter({
            text: t<string, string>("defaults:donate"),
            iconURL: "https://cdn.nhcarrigan.com/profile.png",
          });
          await targetChannel.send({ embeds: [levelEmbed] });
        } else {
          await targetChannel.send({ content, allowedMentions: {} });
        }
      }

      if (serverSettings.level_roles.length) {
        for (const setting of serverSettings.level_roles) {
          if (user.level >= setting.level) {
            const role = guild.roles.cache.find((r) => r.id === setting.role);
            if (role && !member?.roles.cache.find((r) => r.id === role.id)) {
              await member?.roles.add(role);
              const content = serverSettings.role_message
                ? generateRoleText(serverSettings.role_message, author, role)
                : t<string, string>("listeners:level.roleDesc", {
                    user: `<@!${author.id}>`,
                    role: `<@&${role.id}>`,
                  });
              if (serverSettings.level_style === "embed") {
                const roleEmbed = new EmbedBuilder();
                roleEmbed.setTitle(
                  t<string, string>("listeners:level.roleTitle")
                );
                roleEmbed.setDescription(content);
                roleEmbed.setColor(Becca.colours.default);
                roleEmbed.setAuthor({
                  name: author.tag,
                  iconURL: author.displayAvatarURL(),
                });
                roleEmbed.setFooter({
                  text: t<string, string>("defaults:donate"),
                  iconURL: "https://cdn.nhcarrigan.com/profile.png",
                });
                await targetChannel.send({ embeds: [roleEmbed] });
              } else {
                await targetChannel.send({ content, allowedMentions: {} });
              }
            }
          }
        }
      }
    } catch (err) {
      await beccaErrorHandler(
        Becca,
        "level listener",
        err,
        message.guild?.name
      );
    }
  },
};
