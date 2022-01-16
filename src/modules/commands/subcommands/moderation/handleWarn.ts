/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../../utils/customSubstring";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { sendModerationDm } from "../../../../utils/sendModerationDm";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";
import { updateHistory } from "../../moderation/updateHistory";

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

    const target = interaction.options.getUser("target", true);
    const reason = interaction.options.getString("reason", true);

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
    warnEmbed.setTitle("A user has messed up.");
    warnEmbed.setDescription(`Warning issued by ${member.user.username}`);
    warnEmbed.setColor(Becca.colours.warning);
    warnEmbed.addField("Reason", customSubstring(reason, 1000));
    warnEmbed.addField("User Notified?", String(sentNotice));
    warnEmbed.setTimestamp();
    warnEmbed.setAuthor({
      name: target.tag,
      iconURL: target.displayAvatarURL(),
    });

    await interaction.editReply({
      content: `<@!${target.id}>, you have been warned.`,
      embeds: [warnEmbed],
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
      embeds: [errorEmbedGenerator(Becca, "warn", errorId)],
    });
  }
};
