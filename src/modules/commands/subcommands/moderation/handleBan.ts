/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../../utils/customSubstring";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { sendModerationDm } from "../../../../utils/sendModerationDm";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";
import { sendLogEmbed } from "../../../guild/sendLogEmbed";
import { updateHistory } from "../../moderation/updateHistory";

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

    if (
      !member ||
      typeof member.permissions === "string" ||
      !member.permissions.has("BAN_MEMBERS")
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

    if (prune < 0 || prune > 7) {
      await interaction.editReply({
        content: "`prune` value must be between 0 and 7.",
      });
      return;
    }

    const targetMember = await guild.members.fetch(target.id);

    if (!targetMember.bannable) {
      await interaction.editReply({
        content: "I am afraid they are too important for me to remove.",
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
    banLogEmbed.setTitle("I have permanently removed a member.");
    banLogEmbed.setDescription(
      `Member ban was requested by ${member.user.username}`
    );
    banLogEmbed.addField("Reason", customSubstring(reason, 1000));
    banLogEmbed.addField("User notified?", String(sentNotice));
    banLogEmbed.setTimestamp();
    banLogEmbed.setAuthor({
      name: target.tag,
      iconURL: target.displayAvatarURL(),
    });
    banLogEmbed.setFooter(`ID: ${targetMember.id}`);

    await sendLogEmbed(Becca, guild, banLogEmbed, "moderation_events");
    await interaction.editReply({
      content: "They have been banished and shall never return.",
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
      embeds: [errorEmbedGenerator(Becca, "ban", errorId)],
    });
  }
};
