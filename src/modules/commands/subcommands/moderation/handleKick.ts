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
        content: getRandomValue(t("responses:missingGuild")),
      });
      return;
    }

    if (
      !member ||
      typeof member.permissions === "string" ||
      !member.permissions.has("KICK_MEMBERS")
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

    const targetMember = await guild.members.fetch(target.id);

    if (!targetMember.kickable) {
      await interaction.editReply({
        content: t("commands:mod.kick.invalid"),
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

    await targetMember.kick(customSubstring(reason, 1000));

    await updateHistory(Becca, "kick", target.id, guild.id);

    const kickLogEmbed = new MessageEmbed();
    kickLogEmbed.setColor(Becca.colours.error);
    kickLogEmbed.setTitle(t("commands:mod.kick.title"));
    kickLogEmbed.setDescription(
      t("commands:mod.kick.description", { user: member.user.username })
    );
    kickLogEmbed.addField(
      t("commands:mod.kick.reason"),
      customSubstring(reason, 1000)
    );
    kickLogEmbed.addField(t("commands:mod.kick.notified"), String(sentNotice));
    kickLogEmbed.setTimestamp();
    kickLogEmbed.setAuthor({
      name: target.tag,
      iconURL: target.displayAvatarURL(),
    });
    kickLogEmbed.setFooter(`ID: ${targetMember.id}`);

    await sendLogEmbed(Becca, guild, kickLogEmbed, "moderation_events");
    await interaction.editReply({ content: t("commands:mod.kick.success") });
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
