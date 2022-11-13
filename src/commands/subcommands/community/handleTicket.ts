/* eslint-disable jsdoc/require-param */
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  GuildChannelCreateOptions,
  PermissionFlagsBits,
  TextChannel,
} from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { createLogFile } from "../../../modules/tickets/createLogFile";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Handles the ticket creation flow.
 */
export const handleTicket: CommandHandler = async (
  Becca,
  interaction,
  t,
  config
) => {
  try {
    const { guild } = interaction;

    if (!guild) {
      await interaction.editReply({
        content: getRandomValue(t<string, string[]>("responses:missingGuild")),
      });
      return;
    }

    if (!config.ticket_category || !config.ticket_log_channel) {
      await interaction.editReply({
        content: t<string, string>("commands:community.ticket.disabled"),
      });
      return;
    }

    const reason = interaction.options.getString("reason", true);

    const category =
      guild.channels.cache.get(config.ticket_category) ||
      (await guild.channels.fetch(config.ticket_category));

    if (!category || category.type !== ChannelType.GuildCategory) {
      await interaction.editReply({
        content: t<string, string>("commands:community.ticket.disabled"),
      });
      return;
    }

    const options = {
      parent: category.id,
      name: `ticket-${interaction.user.tag}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
          ],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
          ],
        },
        {
          id: Becca.user?.id || "oh no",
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
          ],
        },
      ],
    };

    // TODO: logic for ticket role here
    if (config.ticket_role) {
      options.permissionOverwrites.push({
        id: config.ticket_role,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
        ],
      });
    }

    const ticketChannel = (await guild.channels.create(
      options as GuildChannelCreateOptions
    )) as TextChannel;

    const claimButton = new ButtonBuilder()
      .setCustomId("ticket-claim")
      .setStyle(ButtonStyle.Success)
      .setLabel("Claim this ticket!")
      .setEmoji("✋");
    const closeButton = new ButtonBuilder()
      .setCustomId("ticket-close")
      .setStyle(ButtonStyle.Danger)
      .setLabel("Close this ticket!")
      .setEmoji("🗑️");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
      claimButton,
      closeButton,
    ]);

    const ticketEmbed = new EmbedBuilder();
    ticketEmbed.setTitle("Ticket Created");
    ticketEmbed.setDescription(
      `<@!${interaction.user.id}> opened a ticket for:\n${reason}`
    );

    await createLogFile(Becca, guild.id, ticketChannel.id);

    await ticketChannel.send({ embeds: [ticketEmbed], components: [row] });
    await interaction.editReply(
      "Your ticket channel has been created! Please head there and describe the issue you are having."
    );
  } catch (err) {
    await beccaErrorHandler(Becca, "handle ticket", err);
  }
};
