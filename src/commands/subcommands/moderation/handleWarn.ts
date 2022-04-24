/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";
import { getRandomValue } from "../../../utils/getRandomValue";
import { sendModerationDm } from "../../../utils/sendModerationDm";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { sendLogEmbed } from "../../../modules/guild/sendLogEmbed";
import { updateHistory } from "../../../modules/commands/moderation/updateHistory";

/**
 * Issues a warning to the `target` user, and adds it to the server's warning count.
 * Logs the `reason`.
 */
export const handleWarn: CommandHandler = async (
  Becca,
  interaction,
  t,
  config
) => {
  try {
    const { guild, member } = interaction;
    if (!guild) {
      await interaction.editReply({
        content: getRandomValue(t("responses:missingGuild")),
      });
      return;
    }

    const target = interaction.options.getUser("target", true);
    const reason = interaction.options.getString("reason", true);

    const targetMember = await guild.members.fetch(target.id);

    if (
      !member ||
      typeof member.permissions === "string" ||
      !member.permissions.has("KICK_MEMBERS") ||
      !targetMember ||
      targetMember.permissions.has("KICK_MEMBERS")
    ) {
      await interaction.editReply({
        content: getRandomValue(t("responses:noPermission")),
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

    const sentNotice = await sendModerationDm(
      Becca,
      config,
      t,
      "warn",
      target,
      reason
    );

    await updateHistory(Becca, "warn", target.id, guild.id);

    const warnEmbed = new MessageEmbed();
    warnEmbed.setTitle(t("commands:mod.warn.title"));
    warnEmbed.setDescription(
      t("commands:mod.warn.description", { user: member.user.username })
    );
    warnEmbed.setColor(Becca.colours.warning);
    warnEmbed.addField(
      t("commands:mod.warn.reason"),
      customSubstring(reason, 1000)
    );
    warnEmbed.addField(t("commands:mod.warn.notified"), String(sentNotice));
    warnEmbed.setTimestamp();
    warnEmbed.setAuthor({
      name: target.tag,
      iconURL: target.displayAvatarURL(),
    });

    await sendLogEmbed(Becca, guild, warnEmbed, "moderation_events");

    await interaction.editReply({
      content: t("commands:mod.warn.success"),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "warn command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "warn", errorId, t)],
    });
  }
};
