/* eslint-disable jsdoc/require-param */
import {
  GuildChannel,
  GuildMember,
  MessageEmbed,
  NewsChannel,
  TextChannel,
} from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Allows a user to schedule a post to be sent to a specific channel, up to
 * 24 hours in advance. Does not allow for a post to be sent to a channel
 * where the user does not have permission to send messages themselves.
 * Scheduled posts are stored in memory, so are lost in a reboot.
 */
export const handleSchedule: CommandHandler = async (Becca, interaction) => {
  try {
    const { member } = interaction;
    const time = interaction.options.getInteger("time", true);
    const targetChannel = interaction.options.getChannel("channel", true);
    const message = interaction.options.getString("message", true);

    if (
      !member ||
      !(member as GuildMember)
        ?.permissionsIn(targetChannel as GuildChannel)
        .has("SEND_MESSAGES")
    ) {
      await interaction.editReply({
        content: "You are not allowed to send messages in that channel.",
      });
      return;
    }

    if (
      targetChannel.type !== "GUILD_TEXT" &&
      targetChannel.type !== "GUILD_NEWS"
    ) {
      await interaction.editReply({
        content: "That channel is not a text channel.",
      });
      return;
    }

    if (time < 1 || time > 1440) {
      await interaction.editReply({
        content: "You must specify a time between 1 and 1440",
      });
      return;
    }

    setTimeout(async () => {
      await (targetChannel as TextChannel | NewsChannel).send({
        content: `<@!${
          (member as GuildMember).id
        }>, here is your scheduled post:\n${message}`,
        allowedMentions: {
          users: [interaction.user.id],
        },
      });
    }, time * 60000);

    const successEmbed = new MessageEmbed();
    successEmbed.setTitle("Message Scheduled");
    successEmbed.setDescription(
      "I will send your message with the following settings. Please note that my memory is not perfect, and if I need to be restarted your scheduled post will be lost."
    );
    successEmbed.setColor(Becca.colours.default);
    successEmbed.addField("Time", `${time} minutes`, true);
    successEmbed.addField("Target Channel", `<#${targetChannel.id}>`, true);
    successEmbed.addField("Message", message);
    await interaction.editReply({ embeds: [successEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "schedule command",
      err,
      interaction.guild?.name
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "schedule", errorId)],
    });
  }
};
