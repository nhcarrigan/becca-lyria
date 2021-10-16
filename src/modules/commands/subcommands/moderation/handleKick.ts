/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../../utils/customSubstring";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";
import { sendLogEmbed } from "../../../guild/sendLogEmbed";

/**
 * Provided the caller has permission, kicks the `target` user from the guild
 * for the given `reason`.
 */
export const handleKick: CommandHandler = async (Becca, interaction) => {
  try {
    const { guild, member } = interaction;
    const target = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason");

    if (!guild) {
      await interaction.editReply({ content: Becca.responses.missingGuild });
      return;
    }

    if (
      !member ||
      typeof member.permissions === "string" ||
      !member.permissions.has("KICK_MEMBERS")
    ) {
      await interaction.editReply({ content: Becca.responses.noPermission });
      return;
    }

    if (!target) {
      await interaction.editReply({ content: Becca.responses.missingParam });
      return;
    }
    if (target.id === member.user.id) {
      await interaction.editReply({ content: Becca.responses.noModSelf });
      return;
    }
    if (target.id === Becca.user?.id) {
      await interaction.editReply({ content: Becca.responses.noModBecca });
      return;
    }

    const targetMember = await guild.members.fetch(target.id);

    if (!targetMember.kickable) {
      await interaction.editReply({
        content: "I am afraid they are too important for me to remove.",
      });
      return;
    }

    await targetMember.kick(
      customSubstring(reason || Becca.responses.defaultModReason, 1000)
    );

    const kickLogEmbed = new MessageEmbed();
    kickLogEmbed.setColor(Becca.colours.error);
    kickLogEmbed.setTitle("I have removed a member.");
    kickLogEmbed.setDescription(
      `Member removal was requested by ${member.user.username}`
    );
    kickLogEmbed.addField(
      "Reason",
      customSubstring(reason || Becca.responses.defaultModReason, 1000)
    );
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
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "kick", errorId)],
        ephemeral: true,
      })
      .catch(async () => {
        await interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "kick", errorId)],
        });
      });
  }
};
