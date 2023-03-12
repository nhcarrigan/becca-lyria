import {
  ButtonInteraction,
  EmbedBuilder,
  GuildMember,
  PermissionFlagsBits,
  TextBasedChannel,
  TextChannel,
} from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../../../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { getSettings } from "../../../settings/getSettings";
import { generateLogs } from "../../../tickets/generateTicketLog";

/**
 * For the close ticket button.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {ButtonInteraction} interaction The interaction payload from Discord.
 * @param {TFunction} t Translation function.
 */
export const buttonIsTicketClose = async (
  Becca: BeccaLyria,
  interaction: ButtonInteraction,
  t: TFunction
) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const { guild, member, channel } = interaction;

    if (!guild || !member || !channel) {
      await interaction.editReply({
        content: "Error finding the guild!",
      });
      return;
    }

    const config = await getSettings(Becca, guild.id, guild.name);

    if (!config) {
      await interaction.reply({
        content: t<string, string>("events:interaction.noSettings"),
      });
      return;
    }

    const isStaff = (member as GuildMember).permissions.has(
      PermissionFlagsBits.ManageMessages
    );
    if (!isStaff) {
      await interaction.editReply({
        content: "Only staff members can claim a ticket.",
      });
      return;
    }

    const logEmbed = new EmbedBuilder();
    logEmbed.setTitle("Ticket Closed");
    logEmbed.setDescription(`Ticket closed by <@!${member.user.id}>`);
    logEmbed.addFields({
      name: "User",
      value:
        (channel as TextChannel)?.name.split("-").slice(1).join("-") ||
        "unknown",
    });

    if (config.ticket_log_channel) {
      const logEmbed = new EmbedBuilder();
      logEmbed.setTitle("Ticket Closed");
      logEmbed.setDescription(`Ticket closed by <@!${member.user.id}>`);
      logEmbed.addFields({
        name: "User",
        value:
          (channel as TextChannel)?.name.split("-").slice(1).join("-") ||
          "unknown",
      });

      const logFile = await generateLogs(Becca, guild.id, channel.id);
      const logChannel =
        guild.channels.cache.get(config.ticket_log_channel) ||
        (await guild.channels.fetch(config.ticket_log_channel));

      if (logChannel) {
        await (logChannel as TextBasedChannel).send({
          embeds: [logEmbed],
          files: [logFile],
        });
      }
    }

    await channel.delete();
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "close ticket button",
      err,
      interaction.guild?.name
    );
  }
};
