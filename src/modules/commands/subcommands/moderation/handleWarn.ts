/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../../utils/customSubstring";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";
import { updateWarningCount } from "../../../commands/moderation/updateWarningCount";

/**
 * Issues a warning to the `target` user, and adds it to the server's warning count.
 * Logs the `reason`.
 */
export const handleWarn: CommandHandler = async (Becca, interaction) => {
  try {
    const { guild, member } = interaction;
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

    const target = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason");

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

    const warnEmbed = new MessageEmbed();
    warnEmbed.setTitle("A user has messed up.");
    warnEmbed.setDescription(`Warning issued by ${member.user.username}`);
    warnEmbed.setColor(Becca.colours.warning);
    warnEmbed.addField(
      "Reason",
      customSubstring(reason || Becca.responses.defaultModReason, 1000)
    );
    warnEmbed.setTimestamp();
    warnEmbed.setAuthor(
      `${target.username}#${target.discriminator}`,
      target.displayAvatarURL()
    );

    await updateWarningCount(
      Becca,
      guild,
      target,
      reason || Becca.responses.defaultModReason
    );

    await interaction.editReply({
      content: `<@!${target.id}>, you have been warned.`,
      embeds: [warnEmbed],
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "warn command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "warn", errorId)],
        ephemeral: true,
      })
      .catch(async () => {
        await interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "warn", errorId)],
        });
      });
  }
};
