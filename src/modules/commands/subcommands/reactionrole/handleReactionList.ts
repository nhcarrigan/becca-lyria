/* eslint-disable jsdoc/require-param */
import { Guild, MessageEmbed, TextBasedChannel } from "discord.js";

import ReactionRoleModel from "../../../../database/models/ReactionRoleModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Generates an embed listing the reaction roles assigned to a provided message.
 */
export const handleReactionList: CommandHandler = async (
  Becca,
  interaction
) => {
  try {
    const guild = interaction.guild as Guild;
    const messageLink = interaction.options.getString("message", true);
    const [messageId, channelId, serverId] = messageLink.split("/").reverse();

    const targetChannel = guild.channels.cache.get(
      channelId
    ) as TextBasedChannel;
    const targetMessage = await targetChannel?.messages.fetch(messageId);

    if (!targetMessage) {
      await interaction.editReply("That message does not exist.");
      return;
    }

    const reactionRoles = await ReactionRoleModel.find({
      messageId,
      channelId,
      serverId,
    });

    if (!reactionRoles.length) {
      await interaction.editReply("That message has no reaction roles.");
      return;
    }

    const listEmbed = new MessageEmbed();
    listEmbed.setTitle("Reaction Roles");
    listEmbed.setColor(Becca.colours.default);
    listEmbed.setDescription(
      reactionRoles.map((el) => `${el.emoji}: <@&${el.roleId}>`).join("\n")
    );
    listEmbed.addField("Message", messageLink);
    listEmbed.setTimestamp();
    listEmbed.setFooter(
      "Like the bot? Donate: https://donate.nhcarrigan.com",
      "https://cdn.nhcarrigan.com/profile-transparent.png"
    );

    await interaction.editReply({ embeds: [listEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "handleReactionList command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "handleReactionList", errorId)],
    });
  }
};
