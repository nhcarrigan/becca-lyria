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
 * If the server has configured a muted role, removes it from the `target` for the
 * given `reason`.
 */
export const handleUnmute: CommandHandler = async (
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
      !member.permissions.has(PermissionFlagsBits.ModerateMembers) ||
      !targetMember ||
      targetMember.permissions.has(PermissionFlagsBits.ModerateMembers)
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

    const targetUser = await guild.members.fetch(target.id);

    await targetUser.timeout(
      null,
      customSubstring(
        `Moderator: ${interaction.user.tag}\n\nReason: ${reason}`,
        512
      )
    );

    await updateHistory(Becca, "unmute", target.id, guild.id);

    const sentNotice = await sendModerationDm(
      Becca,
      config,
      t,
      "unmute",
      target,
      reason
    );

    const muteEmbed = new EmbedBuilder();
    muteEmbed.setTitle(t("commands:mod.unmute.title"));
    muteEmbed.setDescription(
      t("commands:mod.unmute.description", {
        user: member.user.username,
      })
    );
    muteEmbed.setColor(Becca.colours.success);
    muteEmbed.addFields([
      {
        name: t("commands:mod.unmute.reason"),
        value: customSubstring(reason, 1000),
      },
      {
        name: t("commands:mod.unmute.notified"),
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
      content: t("commands:mod.unmute.success"),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "unmute command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "unmute", errorId, t)],
    });
  }
};
