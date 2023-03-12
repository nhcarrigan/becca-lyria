import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  GuildMember,
  PermissionFlagsBits,
} from "discord.js";

import { BeccaLyria } from "../../../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";

/**
 * For the claim ticket button.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {ButtonInteraction} interaction The interaction payload from Discord.
 */
export const buttonIsTicketClaim = async (
  Becca: BeccaLyria,
  interaction: ButtonInteraction
) => {
  try {
    await interaction.deferReply({ ephemeral: true });

    const { guild, message, member } = interaction;
    const { embeds } = message;

    if (!guild || !member) {
      await interaction.editReply({
        content: "Error finding the guild!",
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

    const ticketEmbed = embeds[0];
    const updatedEmbed = {
      title: ticketEmbed.title || "Unknown title",
      description: ticketEmbed.description || "Unknown reason",
      fields: [{ name: "Claimed by:", value: `<@${member.user.id}>` }],
    };

    const claimButton = new ButtonBuilder()
      .setCustomId("ticket-claim")
      .setStyle(ButtonStyle.Success)
      .setLabel("Claim this ticket!")
      .setEmoji("✋")
      .setDisabled(true);
    const closeButton = new ButtonBuilder()
      .setCustomId("ticket-close")
      .setStyle(ButtonStyle.Danger)
      .setLabel("Close this ticket!")
      .setEmoji("🗑️");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
      claimButton,
      closeButton,
    ]);

    await message.edit({
      embeds: [updatedEmbed],
      components: [row],
    });

    await interaction.editReply("You have been assigned this ticket.");
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "ticket claim button",
      err,
      interaction.guild?.name
    );
  }
};
