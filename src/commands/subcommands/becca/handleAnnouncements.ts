import { ChannelType, PermissionFlagsBits, TextChannel } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Adds Becca's announcement channel to a channel.
 */
export const handleAnnouncements: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const target = interaction.options.getChannel("channel", true, [
      ChannelType.GuildText,
    ]);

    const home =
      Becca.guilds.cache.get(Becca.configs.homeGuild) ||
      (await Becca.guilds.fetch(Becca.configs.homeGuild));
    const me = await home.members
      .fetch(Becca.user?.id || "oopsie")
      .catch(() => null);

    if (
      !me ||
      !me.permissionsIn(target).has(PermissionFlagsBits.ManageWebhooks)
    ) {
      await interaction.editReply({
        content: t("commands:becca.announcements.noPerms"),
      });
      return;
    }

    const announcementChannel =
      home.channels.cache.get(Becca.configs.announcementChannel) ||
      (await home.channels.fetch(Becca.configs.announcementChannel));

    if (announcementChannel?.type !== ChannelType.GuildAnnouncement) {
      await interaction.editReply({
        content: t("commands:becca.announcements.noAnnouncements"),
      });
      return;
    }

    await announcementChannel.addFollower(
      target,
      "Requested via `/becca announcements` command."
    );
    await interaction.editReply({
      content: t<string, string>("commands:becca.announcements.success", {
        channel: target.toString(),
      }),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "uptime command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "announcements", errorId, t)],
    });
  }
};
