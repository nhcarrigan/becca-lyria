import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Embed,
  EmbedBuilder,
  GuildMember,
  Interaction,
  InteractionType,
  Message,
  PermissionFlagsBits,
  TextChannel,
} from "discord.js";
import { getFixedT } from "i18next";

import { handleFeedbackModal } from "../../commands/subcommands/becca/handleFeedbackModal";
import { handleCreateModal } from "../../commands/subcommands/post/handleCreateModal";
import { handleEditModal } from "../../commands/subcommands/post/handleEditModal";
import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { currencyListener } from "../../listeners/currencyListener";
import { usageListener } from "../../listeners/usageListener";
import { logActivity } from "../../modules/commands/logActivity";
import { reactionButtonClick } from "../../modules/events/reactionButtonClick";
import { getSettings } from "../../modules/settings/getSettings";
import { generateLogs } from "../../modules/tickets/generateTicketLog";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { getInteractionLanguage } from "../../utils/getLangCode";

/**
 * Processes logic when a new interaction is created. Interactions come in various
 * forms, and represent some sort of user engagement with Becca on Discord.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {Interaction} interaction The interaction payload received from Discord.
 */
export const interactionCreate = async (
  Becca: BeccaLyria,
  interaction: Interaction
): Promise<void> => {
  try {
    Becca.pm2.metrics.events.mark();
    const lang = getInteractionLanguage(interaction);
    const t = getFixedT(lang);
    if (interaction.isChatInputCommand()) {
      await logActivity(Becca, interaction.user.id, "command");
      const target = Becca.commands.find(
        (el) => el.data.name === interaction.commandName
      );
      if (!target) {
        interaction.reply({
          content: t<string, string>("events:interaction.bad", {
            command: interaction.commandName,
          }),
        });
        return;
      }
      if (!interaction.guildId || !interaction.guild) {
        await interaction.reply({
          content: t<string, string>("events:interaction.noDms"),
        });
        return;
      }
      const config = await getSettings(
        Becca,
        interaction.guildId,
        interaction.guild.name
      );
      if (!config) {
        await interaction.reply({
          content: t<string, string>("events:interaction.noSettings"),
        });
        return;
      }
      await target.run(Becca, interaction, t, config);
      await usageListener.run(Becca, interaction);
      await currencyListener.run(Becca, interaction);
    }

    if (interaction.isContextMenuCommand()) {
      await logActivity(Becca, interaction.user.id, "context");
      const target = Becca.contexts.find(
        (el) => el.data.name === interaction.commandName
      );
      if (!target) {
        interaction.reply({
          content: t<string, string>("events:interaction.bad", {
            command: interaction.commandName,
          }),
        });
        return;
      }
      if (!interaction.guildId || !interaction.guild) {
        await interaction.reply({
          content: t<string, string>("events:interaction.noDms"),
        });
        return;
      }
      const config = await getSettings(
        Becca,
        interaction.guildId,
        interaction.guild.name
      );
      if (!config) {
        await interaction.reply({
          content: t<string, string>("events:interaction.noSettings"),
        });
        return;
      }
      await target.run(Becca, interaction, t, config);
    }

    if (interaction.isButton()) {
      await logActivity(Becca, interaction.user.id, "button");
      if (interaction.customId === "delete-bookmark") {
        await (interaction.message as Message).delete();
      }
      if (interaction.customId.startsWith("rr-")) {
        await interaction.deferReply({ ephemeral: true });
        await reactionButtonClick(Becca, t, interaction);
      }

      if (interaction.customId === "claim-ticket") {
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

        const ticketEmbed = embeds[0] as Embed;
        const updatedEmbed = {
          ...ticketEmbed,
          fields: [{ name: "Claimed by:", value: `<@${member.user.id}>` }],
        };

        const claimButton = new ButtonBuilder()
          .setCustomId("claim")
          .setStyle(ButtonStyle.Success)
          .setLabel("Claim this ticket!")
          .setEmoji("✋")
          .setDisabled(true);
        const closeButton = new ButtonBuilder()
          .setCustomId("close")
          .setStyle(ButtonStyle.Danger)
          .setLabel("Close this ticket!")
          .setEmoji("🗑️");

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
          claimButton,
          closeButton,
        ]);

        await (message as Message).edit({
          embeds: [updatedEmbed],
          components: [row],
        });

        await interaction.editReply("You have been assigned this ticket.");
      }

      if (interaction.customId === "close-ticket") {
        try {
          await interaction.deferReply({ ephemeral: true });
          const { guild, member, channel } = interaction;

          if (!guild || !member || !channel) {
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
          // await Becca.logHook.send({ embeds: [logEmbed], files: [logFile] });
          await channel.delete();
        } catch (err) {
          await beccaErrorHandler(Becca, "ticket close handler", err);
        }
      }
    }

    if (interaction.isSelectMenu()) {
      await logActivity(Becca, interaction.user.id, "select");
    }

    if (interaction.type === InteractionType.ModalSubmit) {
      if (interaction.customId === "feedback-modal") {
        await handleFeedbackModal(Becca, interaction, t);
      }
      if (interaction.customId.startsWith("pc-")) {
        await handleCreateModal(Becca, interaction, t);
      }
      if (interaction.customId.startsWith("pe-")) {
        await handleEditModal(Becca, interaction, t);
      }
    }
  } catch (err) {
    await beccaErrorHandler(Becca, "interaction create event", err);
  }
};
