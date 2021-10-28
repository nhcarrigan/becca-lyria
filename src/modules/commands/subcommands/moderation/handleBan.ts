/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../../utils/customSubstring";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";
import { sendLogEmbed } from "../../../guild/sendLogEmbed";

/**
 * Bans the `target` user for the provided `reason`, assuming the caller has permissions.
 * Also deletes the `target`'s messages from the last 24 hours.
 */
export const handleBan: CommandHandler = async (Becca, interaction) => {
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
      !member.permissions.has("BAN_MEMBERS")
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

    if (!targetMember.bannable) {
      await interaction.editReply({
        content: "I am afraid they are too important for me to remove.",
      });
      return;
    }

    await targetMember.ban({
      reason: customSubstring(reason, 1000),
      days: 1,
    });

    const kickLogEmbed = new MessageEmbed();
    kickLogEmbed.setColor(Becca.colours.error);
    kickLogEmbed.setTitle("I have permanently removed a member.");
    kickLogEmbed.setDescription(
      `Member ban was requested by ${member.user.username}`
    );
    kickLogEmbed.addField("Reason", customSubstring(reason, 1000));
    kickLogEmbed.setTimestamp();
    kickLogEmbed.setAuthor(
      `${targetMember.user.username}#${targetMember.user.discriminator}`,
      targetMember.user.displayAvatarURL()
    );
    kickLogEmbed.setFooter(`ID: ${targetMember.id}`);

    await sendLogEmbed(Becca, guild, kickLogEmbed, "moderation_events");
    await interaction.editReply({
      content: "They have been banished and shall never return.",
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "ban command",
      err,
      interaction.guild?.name
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "ban", errorId)],
    });
  }
};
