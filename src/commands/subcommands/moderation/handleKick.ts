/* eslint-disable jsdoc/require-param */
import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { DefaultTFuncReturn } from "i18next";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { updateHistory } from "../../../modules/commands/moderation/updateHistory";
import { sendLogEmbed } from "../../../modules/guild/sendLogEmbed";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";
import { getRandomValue } from "../../../utils/getRandomValue";
import { sendModerationDm } from "../../../utils/sendModerationDm";

/**
 * Provided the caller has permission, kicks the `target` user from the guild
 * for the given `reason`.
 */
export const handleKick: CommandHandler = async (
  Becca,
  interaction,
  t,
  config
) => {
  try {
    const { guild, member } = interaction;
    const target = interaction.options.getUser("target", true);
    const reason = interaction.options.getString("reason", true);

    if (!guild) {
      await interaction.editReply({
        content: getRandomValue(
          t<string, DefaultTFuncReturn & string[]>("responses:missingGuild")
        ),
      });
      return;
    }

    const targetMember = await guild.members.fetch(target.id).catch(() => null);

    if (
      !member ||
      typeof member.permissions === "string" ||
      !member.permissions.has(PermissionFlagsBits.KickMembers) ||
      (targetMember &&
        targetMember.permissions.has(PermissionFlagsBits.KickMembers))
    ) {
      await interaction.editReply({
        content: getRandomValue(
          t<string, DefaultTFuncReturn & string[]>("responses:noPermission")
        ),
      });
      return;
    }

    if (!targetMember) {
      await interaction.editReply({
        content: "That user appears to have left the guild.",
      });
      return;
    }

    if (target.id === member.user.id) {
      await interaction.editReply({
        content: getRandomValue(
          t<string, DefaultTFuncReturn & string[]>("responses:noModSelf")
        ),
      });
      return;
    }
    if (target.id === Becca.user?.id) {
      await interaction.editReply({
        content: getRandomValue(
          t<string, DefaultTFuncReturn & string[]>("responses:noModBecca")
        ),
      });
      return;
    }

    if (!targetMember.kickable) {
      await interaction.editReply({
        content: t<string, string>("commands:mod.kick.invalid"),
      });
      return;
    }

    const sentNotice = await sendModerationDm(
      Becca,
      config,
      t,
      "kick",
      target,
      reason
    );

    await targetMember.kick(
      customSubstring(
        `Moderator: ${interaction.user.tag}\n\nReason: ${reason}`,
        512
      )
    );

    await updateHistory(Becca, "kick", target.id, guild.id);

    const kickLogEmbed = new EmbedBuilder();
    kickLogEmbed.setColor(Becca.colours.error);
    kickLogEmbed.setTitle(t<string, string>("commands:mod.kick.title"));
    kickLogEmbed.setDescription(
      t<string, string>("commands:mod.kick.description", {
        user: member.user.username,
      })
    );
    kickLogEmbed.addFields([
      {
        name: t<string, string>("commands:mod.kick.reason"),
        value: customSubstring(reason, 1000),
      },
      {
        name: t<string, string>("commands:mod.kick.notified"),
        value: String(sentNotice),
      },
    ]);
    kickLogEmbed.setTimestamp();
    kickLogEmbed.setAuthor({
      name: target.tag,
      iconURL: target.displayAvatarURL(),
    });
    kickLogEmbed.setFooter({ text: `ID: ${targetMember.id}` });

    await sendLogEmbed(Becca, guild, kickLogEmbed, "moderation_events");
    await interaction.editReply({
      content: t<string, string>("commands:mod.kick.success"),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "kick command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "kick", errorId, t)],
    });
  }
};
