/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../../utils/customSubstring";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";
import { sendLogEmbed } from "../../../guild/sendLogEmbed";

/**
 * If the server has configured a muted role, removes it from the `target` for the
 * given `reason`.
 */
export const handleUnmute: CommandHandler = async (
  Becca,
  interaction,
  config
) => {
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

    const targetUser = await guild.members.fetch(target.id);

    const mutedRole = guild.roles.cache.find(
      (el) => el.id === config.muted_role
    );

    if (!mutedRole) {
      await interaction.editReply({
        content: "I do not know the magic words to lift the curse.",
      });
      return;
    }

    if (!targetUser.roles.cache.has(mutedRole.id)) {
      await interaction.editReply({
        content: "This user is not cursed.",
      });
      return;
    }

    await targetUser.roles.remove(mutedRole);

    const muteEmbed = new MessageEmbed();
    muteEmbed.setTitle("A user is no longer silenced!");
    muteEmbed.setDescription(`The curse was lifted by ${member.user.username}`);
    muteEmbed.setColor(Becca.colours.success);
    muteEmbed.addField(
      "Reason",
      customSubstring(reason || Becca.responses.defaultModReason, 1000)
    );
    muteEmbed.setFooter(`ID: ${targetUser.id}`);
    muteEmbed.setTimestamp();
    muteEmbed.setAuthor(
      `${targetUser.user.username}#${targetUser.user.discriminator}`,
      targetUser.user.displayAvatarURL()
    );

    await sendLogEmbed(Becca, guild, muteEmbed, "moderation_events");

    await interaction.editReply({
      content: "That user may speak once more.",
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "unmute command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "unmute", errorId)],
        ephemeral: true,
      })
      .catch(async () => {
        await interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "unmute", errorId)],
        });
      });
  }
};
