/* eslint-disable jsdoc/require-param */
import { GuildMember, MessageEmbed } from "discord.js";

import levelScale from "../../../../config/listeners/levelScale";
import { LevelOptOut } from "../../../../config/optout/LevelOptOut";
import LevelModel from "../../../../database/models/LevelModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**i
 * Allows the suggestion embed with the given `id` to be marked as approved or
 * denied (determined by the `action`). Appends the `action` and the `reason` to the
 * suggestion embed.
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

    if (target?.id === member.user.id) {
      await interaction.editReply({
        content: getRandomValue(Becca.responses.noSelfXP),
      });
      return;
    }

    if (target?.bot) {
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

    const server =
      (await LevelModel.findOne({ serverID: guild.id })) ||
      (await LevelModel.create({
        serverID: guild.id,
        serverName: guild.name,
        users: [],
      }));

    let user = server.users.find((u) => u.userID === target?.id);

    if (!user) {
      user = {
        userID: target?.id,
        userTag: target?.tag,
        avatar: target?.displayAvatarURL(),
        level: 0,
        points: 0,
        lastSeen: new Date(Date.now()),
        cooldown: 0,
      };
      server.users.push(user);
    }

    if (action === "add") {
      if (user.points + amount >= levelScale[user.level + 1]) {
        await interaction.editReply({
          content: "Can't increase XP beyond level cap.",
        });
        return;
      }
      user.points += amount;
    } else {
      if (user.points - amount <= 0) {
        await interaction.editReply({
          content: "Can't reduce XP below 0.",
        });
        return;
      }
      user.points -= amount;
    }
    user.userTag = target?.tag;
    user.avatar = target?.displayAvatarURL();

    let levelUp = false;

    while (user.points > levelScale[user.level + 1]) {
      user.level++;
      levelUp = true;
    }

    server.markModified("users");
    await server.save();

    const xpmodifyEmbed = new MessageEmbed();
    xpmodifyEmbed.setTitle("XP Modified");
    if (action === "add") {
      xpmodifyEmbed.setDescription(
        `<@!${member?.user?.id}> has granted ${amount} XP to <@!${target?.id}>!`
      );
    } else {
      xpmodifyEmbed.setDescription(
        `<@!${member?.user?.id}> has taken away ${amount} XP from <@!${target.id}>!`
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
