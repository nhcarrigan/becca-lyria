/* eslint-disable jsdoc/require-jsdoc */
import { MessageEmbed, TextChannel } from "discord.js";

import levelScale from "../config/listeners/levelScale";
import { LevelOptOut } from "../config/optout/LevelOptOut";
import LevelModel from "../database/models/LevelModel";
import { Listener } from "../interfaces/listeners/Listener";
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
  run: async (Becca, message, serverSettings) => {
    try {
      const { author, content, guild, member } = message;

      if (LevelOptOut.includes(author.id)) {
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
            c.id === serverSettings.level_channel && c.type === "GUILD_TEXT"
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

      if (Date.now() - user.cooldown < 300000 || user.level >= 100) {
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
        const levelEmbed = new MessageEmbed();
        levelEmbed.setTitle("Level Up!");
        levelEmbed.setDescription(
          `<@!${author.id}> has grown stronger. They are now level ${user.level}.`
        );
        levelEmbed.setColor(Becca.colours.default);
        levelEmbed.setAuthor(
          `${author.username}#${author.discriminator}`,
          author.displayAvatarURL()
        );
        levelEmbed.setFooter(
          "Like the bot? Donate: https://donate.nhcarrigan.com"
        );
        await targetChannel.send({ embeds: [levelEmbed] });
      }

      if (serverSettings.level_roles.length) {
        for (const setting of serverSettings.level_roles) {
          if (user.level >= setting.level) {
            const role = guild.roles.cache.find((r) => r.id === setting.role);
            if (role && !member?.roles.cache.find((r) => r.id === role.id)) {
              await member?.roles.add(role);
              const roleEmbed = new MessageEmbed();
              roleEmbed.setTitle("A title has been granted!");
              roleEmbed.setDescription(
                `<@!${author.id}> has earned the <@&${role.id}> title!`
              );
              roleEmbed.setColor(Becca.colours.default);
              roleEmbed.setAuthor(
                `${author.username}#${author.discriminator}`,
                author.displayAvatarURL()
              );
              roleEmbed.setFooter(
                "Like the bot? Donate: https://donate.nhcarrigan.com"
              );
              await targetChannel.send({ embeds: [roleEmbed] });
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
