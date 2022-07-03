/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { updateHistory } from "../../../modules/commands/moderation/updateHistory";
import { sendLogEmbed } from "../../../modules/guild/sendLogEmbed";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";
import { getRandomValue } from "../../../utils/getRandomValue";
import { sendModerationDm } from "../../../utils/sendModerationDm";

/**
 * Bans the `target` user for the provided `reason`, assuming the caller has permissions.
 * Also deletes the `target`'s messages from the last 24 hours.
 */
export const handleBan: CommandHandler = async (
  Becca,
  interaction,
  t,
  config
) => {
  try {
    const { guild, member } = interaction;
    const target = interaction.options.getUser("target", true);
    const prune = interaction.options.getNumber("prune", true);
    const reason = interaction.options.getString("reason", true);

    if (!guild) {
      await interaction.editReply({
        content: getRandomValue(t("responses:missingGuild")),
      });
      return;
    }

    const targetMember = await guild.members.fetch(target.id).catch(() => null);

    if (
      !member ||
      typeof member.permissions === "string" ||
      !member.permissions.has("BAN_MEMBERS") ||
      (targetMember && targetMember.permissions.has("BAN_MEMBERS"))
    ) {
      await interaction.editReply({
        content: getRandomValue(t("responses:noPermission")),
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
        content: getRandomValue(t("responses:noModSelf")),
      });
      return;
    }
    if (target.id === Becca.user?.id) {
      await interaction.editReply({
        content: getRandomValue(t("responses:noModBecca")),
      });
      return;
    }

    if (prune < 0 || prune > 7) {
      await interaction.editReply({
        content: t("commands:mod.ban.prune"),
      });
      return;
    }

    if (!targetMember.bannable) {
      await interaction.editReply({
        content: t("commands:mod.ban.invalid"),
      });
      return;
    }

    const sentNotice = await sendModerationDm(
      Becca,
      config,
      t,
      "ban",
      target,
      reason
    );

    await targetMember.ban({
      reason: customSubstring(reason, 1000),
      days: prune,
    });

    await updateHistory(Becca, "ban", target.id, guild.id);

    const banLogEmbed = new MessageEmbed();
    banLogEmbed.setColor(Becca.colours.error);
    banLogEmbed.setTitle(t("commands:mod.ban.title"));
    banLogEmbed.setDescription(
      t("commands:mod.ban.description", { user: member.user.username })
    );
    banLogEmbed.addField(
      t("commands:mod.ban.reason"),
      customSubstring(reason, 1000)
    );
    banLogEmbed.addField(t("commands:mod.ban.notified"), String(sentNotice));
    banLogEmbed.setTimestamp();
    banLogEmbed.setAuthor({
      name: target.tag,
      iconURL: target.displayAvatarURL(),
    });
    banLogEmbed.setFooter(`ID: ${targetMember.id}`);

    await sendLogEmbed(Becca, guild, banLogEmbed, "moderation_events");
    await interaction.editReply({
      content: t("commands:mod.ban.success"),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "ban command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "ban", errorId, t)],
    });
  }
};
