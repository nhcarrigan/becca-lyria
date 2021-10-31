/* eslint-disable jsdoc/require-param */
import * as DJS from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Create a new community ticket.
 * Does not work if ticket role and category are not set.
 */
export const handleTicket: CommandHandler = async (Becca, interaction, config) => {
  try {
    const ticketReason = interaction.options.getString("reason", true);

    const hasActiveTicket = interaction.guild.channels.cache.some((ch) => ch.name === `ticket-${interaction.user.id}`);

    if (hasActiveTicket) {
      await interaction.editReply(
        "You already have an active ticket opened."
      );
      return;
    }

    if (!config.ticket_role || !config.ticket_category) {
      await interaction.editReply(
        "The server has not enabled the ticket system."
      );
      return;
    }

    const DEFAULT_PERMS: DJS.OverwriteResolvable[] = [
      {
        id: interaction.user.id,
        allow: [DJS.Permissions.FLAGS.VIEW_CHANNEL, DJS.Permissions.FLAGS.SEND_MESSAGES],
      },
      {
        id: Becca.user.id!,
        allow: [DJS.Permissions.FLAGS.VIEW_CHANNEL, DJS.Permissions.FLAGS.SEND_MESSAGES],
      },
      {
        type: "role",
        id: config.ticket_role as DJS.Snowflake,
        allow: [DJS.Permissions.FLAGS.VIEW_CHANNEL, DJS.Permissions.FLAGS.SEND_MESSAGES],
      },
    ];

    const channel = await interaction.guild.channels.create(
      `ticket-${interaction.user.id}`,
      {
        type: "GUILD_TEXT",
        nsfw: false,
        permissionOverwrites: DEFAULT_PERMS,
        parent: config.ticket_category as DJS.Snowflake,
      },
    );

    await channel?.permissionOverwrites.create(interaction.guild!.id, {
      VIEW_CHANNEL: false,
    });

    const ticketEmbed = new DJS.MessageEmbed()
      .setTitle(`${interaction.user.username}'s ticket`)
      .setDescription(`${ticketReason}`)
      .setColor(Becca.colours.default)
      .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL());

    const buttonRow = new MessageActionRow().addComponents([
      new MessageButton()
      .setLabel("Close")
      .setEmoji("🔒")
      .setCustomId("ticket-close-button")
      .setStyle("DANGER")
      ]);

    channel?.send({ embeds: [ticketEmbed], content: `<@&${config.ticket_role}>` }, components: [buttonRow]);

    await interaction.editReply({
      content: `Your ticket has been created here ${channel?.toString()}`
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "ticket command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "ticket", errorId)],
        ephemeral: true,
      })
      .catch(
        async () =>
          await interaction.editReply({
            embeds: [errorEmbedGenerator(Becca, "ticket", errorId)],
          })
      );
  }
};
