/* eslint-disable jsdoc/require-param */
import { GuildMember, MessageEmbed } from "discord.js";

import levelScale from "../../../../config/listeners/levelScale";
import { LevelOptOut } from "../../../../config/optout/LevelOptOut";
import LevelModel from "../../../../database/models/LevelModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Modifies the xp of a `user` depending on the `action` taken
 * and the `amount` specified.
 */
export const handleXpModify: CommandHandler = async (
  Becca,
  interaction,
  config
) => {
  try {
    const { guild, member } = interaction;

    const action = interaction.options.getString("action", true);
    const target = interaction.options.getUser("user", true);
    const amount = interaction.options.getNumber("adjustment", true);

    if (!guild || !member) {
      await interaction.editReply({
        content: getRandomValue(Becca.responses.missingGuild),
      });
      return;
    }

    if (
      !(member as GuildMember).permissions.has("MANAGE_GUILD") &&
      member.user.id !== Becca.configs.ownerId
    ) {
      await interaction.editReply({
        content: getRandomValue(Becca.responses.noPermission),
      });
      return;
    }

    if (config.levels !== "on") {
      await interaction.editReply({
        content: "Levels aren't enabled in this guild.",
      });
      return;
    }

    if (target.id === member.user.id) {
      await interaction.editReply({
        content: getRandomValue(Becca.responses.noSelfXP),
      });
      return;
    }

    if (target.bot) {
      await interaction.editReply({
        content: getRandomValue(Becca.responses.noBotXP),
      });
      return;
    }

    if (LevelOptOut.includes(target?.id)) {
      await interaction.editReply({
        content: "That member has opted out of the levelling system.",
      });
      return;
    }

    const user =
      (await LevelModel.findOne({ serverID: guild.id, userID: target.id })) ||
      (await LevelModel.create({
        serverID: guild.id,
        serverName: guild.name,
        userID: target?.id,
        userTaf: target?.tag,
        avatar: target?.displayAvatarURL(),
        points: 0,
        level: 0,
        lastSeen: new Date(Date.now()),
        cooldown: 0,
      }));

    if (action === "add") {
      if (user.level >= 100) {
        await interaction.editReply({
          content: "That user has maxed out... over 9000!!!",
        });
        return;
      }
      user.points += amount;
      while (user.points > levelScale[user.level + 1]) {
        user.level++;
      }
    } else {
      if (user.points - amount <= 0) {
        await interaction.editReply({
          content: "Can't reduce XP below 0.",
        });
        return;
      }
      user.points -= amount;
      while (user.points <= levelScale[user.level]) {
        user.level--;
      }
    }

    user.userTag = target?.tag;
    user.avatar = target?.displayAvatarURL();

    await user.save();

    const xpmodifyEmbed = new MessageEmbed();
    xpmodifyEmbed.setTitle("XP Modified");
    if (action === "add") {
      xpmodifyEmbed.setDescription(
        `<@!${member.user.id}> has granted ${amount} XP to <@!${target.id}>!`
      );
    } else {
      xpmodifyEmbed.setDescription(
        `<@!${member.user.id}> has taken away ${amount} XP from <@!${target.id}>!`
      );
    }
    xpmodifyEmbed.setColor(Becca.colours.default);
    await interaction.editReply({
      embeds: [xpmodifyEmbed],
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "xpmodify command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "xpmodify", errorId)],
        ephemeral: true,
      })
      .catch(async () => {
        await interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "xpmodify", errorId)],
        });
      });
  }
};
