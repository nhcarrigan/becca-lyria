/* eslint-disable jsdoc/require-param */
/* eslint-disable */
import { EmbedBuilder, PermissionFlagsBits } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { calculateMilliseconds } from "../../../utils/calculateMilliseconds";
import { customSubstring } from "../../../utils/customSubstring";
import { getRandomValue } from "../../../utils/getRandomValue";
import { sendModerationDm } from "../../../utils/sendModerationDm";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { sendLogEmbed } from "../../../modules/guild/sendLogEmbed";
import { updateHistory } from "../../../modules/commands/moderation/updateHistory";

/**
 * If the server has configured a muted role, applies that role to the `target`
 * user for the given `reason`.
 */
export const handleMute: CommandHandler = async (
  Becca,
  interaction,
  t,
  config
) => {
  try {
    const { guild, member } = interaction;
    const target = interaction.options.getUser("target", true);
    const duration = interaction.options.getInteger("duration", true);
    const durationUnit = interaction.options.getString("unit", true);
    const reason = interaction.options.getString("reason", true);
    const durationMilliseconds = calculateMilliseconds(duration, durationUnit);

    if (!durationMilliseconds) {
      await interaction.editReply({
        content: t<string, string>("commands:mod.mute.invalid", {
          duration,
          durationUnit,
        }),
      });
      return;
    }

    if (durationMilliseconds > 2419200000) {
      await interaction.editReply({
        content: t<string, string>("commands:mod.mute.long"),
      });
      return;
    }

    if (!guild) {
      await interaction.editReply({
        content: getRandomValue(t<string, string[]>("responses:missingGuild")),
      });
      return;
    }

    const targetMember = await guild.members.fetch(target.id);

    if (
      !member ||
      typeof member.permissions === "string" ||
      !member.permissions.has(PermissionFlagsBits.ModerateMembers) ||
      !targetMember ||
      targetMember.permissions.has(PermissionFlagsBits.ModerateMembers)
    ) {
      await interaction.editReply({
        content: getRandomValue(t<string, string[]>("responses:noPermission")),
      });
      return;
    }

    if (target.id === member.user.id) {
      await interaction.editReply({
        content: getRandomValue(t<string, string[]>("responses:noModSelf")),
      });
      return;
    }
    if (target.id === Becca.user?.id) {
      await interaction.editReply({
        content: getRandomValue(t<string, string[]>("responses:noModBecca")),
      });
      return;
    }

    const targetUser = await guild.members.fetch(target.id);

    const sentNotice = await sendModerationDm(
      Becca,
      config,
      t,
      "mute",
      target,
      reason
    );

    await targetUser.timeout(
      durationMilliseconds,
      customSubstring(
        `Moderator: ${interaction.user.tag}\n\nReason: ${reason}`,
        512
      )
    );

    await updateHistory(Becca, "mute", target.id, guild.id);

    const muteEmbed = new EmbedBuilder();
    muteEmbed.setTitle(t<string, string>("commands:mod.mute.title"));
    muteEmbed.setDescription(
      t<string, string>("commands:mod.mute.description", {
        user: member.user.username,
      })
    );
    muteEmbed.setColor(Becca.colours.warning);
    muteEmbed.addFields([
      {
        name: t<string, string>("commands:mod.mute.reason"),
        value: customSubstring(reason, 1000),
      },
      {
        name: t<string, string>("commands:mod.mute.duration"),
        value: `${duration} ${durationUnit}`,
      },
      {
        name: t<string, string>("commands:mod.mute.notified"),
        value: String(sentNotice),
      },
    ]);
    muteEmbed.setFooter({ text: `ID: ${targetUser.id}` });
    muteEmbed.setTimestamp();
    muteEmbed.setAuthor({
      name: target.tag,
      iconURL: target.displayAvatarURL(),
    });

    await sendLogEmbed(Becca, guild, muteEmbed, "moderation_events");

    await interaction.editReply({
      content: t<string, string>("commands:mod.mute.success"),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "mute command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "mute", errorId, t)],
    });
  }
};
