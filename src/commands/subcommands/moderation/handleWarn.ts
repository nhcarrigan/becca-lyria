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
    const target = interaction.options.getUser("target", true);
    const reason = interaction.options.getString("reason", true);
    const targetMember = await guild.members.fetch(target.id);

    if (
      !member.permissions.has(PermissionFlagsBits.KickMembers) ||
      !targetMember ||
      targetMember.permissions.has(PermissionFlagsBits.KickMembers)
    ) {
      await interaction.editReply({
        content: getRandomValue(
          t<string, DefaultTFuncReturn & string[]>("responses:noPermission")
        ),
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

    const sentNotice = await sendModerationDm(
      Becca,
      config,
      t,
      "warn",
      target,
      reason
    );

    await updateHistory(Becca, "warn", target.id, guild.id);

    const warnEmbed = new EmbedBuilder();
    warnEmbed.setTitle(t("commands:mod.warn.title"));
    warnEmbed.setDescription(
      t("commands:mod.warn.description", {
        user: member.user.username,
      })
    );
    warnEmbed.setColor(Becca.colours.warning);
    warnEmbed.addFields([
      {
        name: t("commands:mod.warn.reason"),
        value: customSubstring(reason, 1000),
      },
      {
        name: t("commands:mod.warn.notified"),
        value: String(sentNotice),
      },
    ]);
    warnEmbed.setTimestamp();
    warnEmbed.setAuthor({
      name: target.tag,
      iconURL: target.displayAvatarURL(),
    });
    warnEmbed.setFooter({
      text: `ID: ${target.id}`,
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
