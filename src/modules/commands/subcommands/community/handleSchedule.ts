/* eslint-disable jsdoc/require-param */
import {
  GuildBasedChannel,
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
export const handleSchedule: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { member } = interaction;
    const time = interaction.options.getInteger("time", true);
    const targetChannel = interaction.options.getChannel("channel", true);
    const message = interaction.options.getString("message", true);

    if (
      !member ||
      !(member as GuildMember)
        ?.permissionsIn(targetChannel as GuildBasedChannel)
        .has("SEND_MESSAGES")
    ) {
      await interaction.editReply({
        content: t("commands:community.schedule.permission"),
      });
      return;
    }

    if (
      targetChannel.type !== "GUILD_TEXT" &&
      targetChannel.type !== "GUILD_NEWS"
    ) {
      await interaction.editReply({
        content: t("commands:community.schedule.notext"),
      });
      return;
    }

    if (time < 1 || time > 1440) {
      await interaction.editReply({
        content: t("commands:community.schedule.badtime"),
      });
      return;
    }

    setTimeout(async () => {
      await (targetChannel as TextChannel | NewsChannel).send({
        content: t("commands:community.schedule.post", {
          id: `<@!${(member as GuildMember).id}`,
          message,
        }),
        allowedMentions: {
          users: [interaction.user.id],
        },
      });
    }, time * 60000);

    const successEmbed = new MessageEmbed();
    successEmbed.setTitle(t("commands:community.schedule.embed.title"));
    successEmbed.setDescription(
      t("commands:community.schedule.embed.description")
    );
    successEmbed.setColor(Becca.colours.default);
    successEmbed.addField(
      t("commands:community.schedule.embed.time"),
      t("commands:community.schedule.embed.minutes", { time }),
      true
    );
    successEmbed.addField(
      t("commands:community.schedule.embed.channel"),
      `<#${targetChannel.id}>`,
      true
    );
    successEmbed.addField(
      t("commands:community.schedule.embeds.message"),
      message
    );
    successEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent",
    });
    await interaction.editReply({ embeds: [successEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "schedule command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "schedule", errorId)],
    });
  }
};
