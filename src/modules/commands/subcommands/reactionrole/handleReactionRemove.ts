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
  interaction,
  t
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
      await interaction.editReply(t("commands:reactionrole.remove.missing"));
      return;
    }
    await reactionRole.delete();

    const removeEmbed = new MessageEmbed();
    removeEmbed.setTitle(t("commands:reactionrole.remove.title"));
    removeEmbed.setColor(Becca.colours.default);
    removeEmbed.setDescription(
      t("commands:reactionrole.remove.description", {
        emote: reactionRole.emoji,
        role: `<@&${reactionRole.roleId}>`,
      })
    );
    removeEmbed.addField(t("commands:reactionrole.remove.link"), messageLink);
    removeEmbed.setTimestamp();
    removeEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
    });

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
