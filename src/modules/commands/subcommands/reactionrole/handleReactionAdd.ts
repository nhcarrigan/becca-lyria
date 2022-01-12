/* eslint-disable jsdoc/require-param */
import { Guild, MessageEmbed, TextBasedChannel } from "discord.js";

import ReactionRoleModel from "../../../../database/models/ReactionRoleModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Adds a reaction role to the provided message.
 */
export const handleReactionAdd: CommandHandler = async (Becca, interaction) => {
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

    const emoji = interaction.options.getString("emoji", true);

    const reacted = await targetMessage
      .react(emoji)
      .then(() => true)
      .catch(() => false);
    if (!reacted) {
      await interaction.editReply("That emoji does not appear to be valid...");
      return;
    }

    const role = interaction.options.getRole("role", true);
    const reactionRole =
      (await ReactionRoleModel.findOne({
        serverId,
        channelId,
        messageId,
        emoji,
      })) ||
      (await ReactionRoleModel.create({
        serverId,
        channelId,
        messageId,
        emoji,
        roleId: role.id,
      }));

    reactionRole.roleId = role.id;
    await reactionRole.save();

    const addEmbed = new MessageEmbed();
    addEmbed.setTitle("Reaction Role Added");
    addEmbed.setColor(Becca.colours.default);
    addEmbed.setDescription(`${emoji} associated with <@&${role.id}>`);
    addEmbed.addField("Message", messageLink);
    addEmbed.setTimestamp();
    addEmbed.setFooter(
      "Like the bot? Donate: https://donate.nhcarrigan.com",
      "https://cdn.nhcarrigan.com/profile-transparent.png"
    );

    await interaction.editReply({ embeds: [addEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "handleReactionAdd command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "handleReactionAdd", errorId)],
    });
  }
};
