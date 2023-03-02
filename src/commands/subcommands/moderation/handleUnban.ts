/* eslint-disable jsdoc/require-param */
import { EmbedBuilder, PermissionFlagsBits } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { updateHistory } from "../../../modules/commands/moderation/updateHistory";
import { sendLogEmbed } from "../../../modules/guild/sendLogEmbed";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Unbans the `target` user for the provided `reason`, assuming the caller has permissions.
 */
export const handleUnban: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { guild, member } = interaction;
    const target = interaction.options.getUser("target", true);
    const reason = interaction.options.getString("reason", true);

    if (!guild) {
      await interaction.editReply({
        content: getRandomValue(t<string, string[]>("responses:missingGuild")),
      });
      return;
    }

    const bannedMember = await guild.bans.fetch(target.id).catch(() => null);

    if (
      !member ||
      typeof member.permissions === "string" ||
      !member.permissions.has(PermissionFlagsBits.BanMembers)
    ) {
      await interaction.editReply({
        content: getRandomValue(t<string, string[]>("responses:noPermission")),
      });
      return;
    }

    if (!bannedMember) {
      await interaction.editReply({
        content: `Cannot find a ban for ${target.tag}`,
      });
      return;
    }

    if (bannedMember.user.id === member.user.id) {
      await interaction.editReply({
        content: getRandomValue(t<string, string[]>("responses:noModSelf")),
      });
      return;
    }
    if (bannedMember.user.id === Becca.user?.id) {
      await interaction.editReply({
        content: getRandomValue(t<string, string[]>("responses:noModBecca")),
      });
      return;
    }

    await guild.bans.remove(
      bannedMember.user.id,
      customSubstring(
        `Moderator: ${interaction.user.tag}\n\nReason: ${reason}`,
        512
      )
    );

    await updateHistory(Becca, "unban", target.id, guild.id);

    const banLogEmbed = new EmbedBuilder();
    banLogEmbed.setColor(Becca.colours.error);
    banLogEmbed.setTitle(t<string, string>("commands:mod.unban.title"));
    banLogEmbed.setDescription(
      t<string, string>("commands:mod.unban.description", {
        user: member.user.username,
      })
    );
    banLogEmbed.addFields([
      {
        name: t<string, string>("commands:mod.unban.reason"),
        value: customSubstring(reason, 1000),
      },
    ]);
    banLogEmbed.setTimestamp();
    banLogEmbed.setAuthor({
      name: bannedMember.user.tag,
      iconURL: bannedMember.user.displayAvatarURL(),
    });
    banLogEmbed.setFooter({ text: `ID: ${bannedMember.user.id}` });

    await sendLogEmbed(Becca, guild, banLogEmbed, "moderation_events");
    await interaction.editReply({
      content: t<string, string>("commands:mod.unban.success"),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "unban command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "unban", errorId, t)],
    });
  }
};