/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import ReactionRoleModel from "../../../../database/models/ReactionRoleModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Removes a reaction role from a message.
 */
export const handleReactionRemove: CommandHandler = async (
  Becca,
  interaction
) => {
  try {
    const messageLink = interaction.options.getString("message", true);
    const [messageId, channelId, serverId] = messageLink.split("/").reverse();
    const emoji = interaction.options.getString("emoji", true);
    const reactionRole = await ReactionRoleModel.findOne({
      serverId,
      channelId,
      messageId,
      emoji,
    });

    if (!reactionRole) {
      await interaction.editReply("That reaction role does not exist.");
      return;
    }
    await reactionRole.delete();

    const removeEmbed = new MessageEmbed();
    removeEmbed.setTitle("Reaction Role Removed");
    removeEmbed.setColor(Becca.colours.default);
    removeEmbed.setDescription(
      `${reactionRole.emoji} no longer associated with <@&${reactionRole.roleId}>`
    );
    removeEmbed.addField("Message", messageLink);
    removeEmbed.setTimestamp();
    removeEmbed.setFooter(
      "Like the bot? Donate: https://donate.nhcarrigan.com",
      "https://cdn.nhcarrigan.com/profile-transparent.png"
    );

    await interaction.editReply({ embeds: [removeEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "handleReactionRemove command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "handleReactionRemove", errorId)],
    });
  }
};
