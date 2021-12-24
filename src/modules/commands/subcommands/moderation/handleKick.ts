/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../../utils/customSubstring";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { sendModerationDm } from "../../../../utils/sendModerationDm";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";
import { sendLogEmbed } from "../../../guild/sendLogEmbed";

/**
 * Provided the caller has permission, kicks the `target` user from the guild
 * for the given `reason`.
 */
export const handleKick: CommandHandler = async (Becca, interaction) => {
  try {
    const { guild, member } = interaction;
    const target = interaction.options.getUser("target", true);
    const reason = interaction.options.getString("reason", true);

    if (!guild) {
      await interaction.editReply({
        content: getRandomValue(Becca.responses.missingGuild),
      });
      return;
    }

    if (
      !member ||
      typeof member.permissions === "string" ||
      !member.permissions.has("KICK_MEMBERS")
    ) {
      await interaction.editReply({
        content: getRandomValue(Becca.responses.noPermission),
      });
      return;
    }

    if (target.id === member.user.id) {
      await interaction.editReply({
        content: getRandomValue(Becca.responses.noModSelf),
      });
      return;
    }
    if (target.id === Becca.user?.id) {
      await interaction.editReply({
        content: getRandomValue(Becca.responses.noModBecca),
      });
      return;
    }

    const targetMember = await guild.members.fetch(target.id);

    if (!targetMember.kickable) {
      await interaction.editReply({
        content: "I am afraid they are too important for me to remove.",
      });
      return;
    }

    const sentNotice = await sendModerationDm(
      Becca,
      "kick",
      target,
      guild.name,
      reason
    );

    await targetMember.kick(customSubstring(reason, 1000));

    const kickLogEmbed = new MessageEmbed();
    kickLogEmbed.setColor(Becca.colours.error);
    kickLogEmbed.setTitle("I have removed a member.");
    kickLogEmbed.setDescription(
      `Member removal was requested by ${member.user.username}`
    );
    kickLogEmbed.addField("Reason", customSubstring(reason, 1000));
    kickLogEmbed.addField("User Notified?", String(sentNotice));
    kickLogEmbed.setTimestamp();
    kickLogEmbed.setAuthor(
      `${targetMember.user.username}#${targetMember.user.discriminator}`,
      targetMember.user.displayAvatarURL()
    );
    kickLogEmbed.setFooter(`ID: ${targetMember.id}`);

    await sendLogEmbed(Becca, guild, kickLogEmbed, "moderation_events");
    await interaction.editReply({ content: "They have been evicted." });
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
      embeds: [errorEmbedGenerator(Becca, "kick", errorId)],
    });
  }
};
