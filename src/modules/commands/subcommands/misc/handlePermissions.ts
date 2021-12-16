/* eslint-disable jsdoc/require-param */
import { GuildMember, MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";
import { validateChannelPerms } from "../../../commands/server/validateChannelPerms";
import { validateServerPerms } from "../../../commands/server/validateServerPerms";

/**
 * Validates that Becca has the correct permissions in the server and the
 * specific channel.
 */
export const handlePermissions: CommandHandler = async (Becca, interaction) => {
  try {
    const { channel, guild, member } = interaction;

    if (!guild || !member || !channel) {
      await interaction.editReply({
        content: getRandomValue(Becca.responses.missingGuild),
      });
      return;
    }

    if (
      !(member as GuildMember).permissions.has("MANAGE_GUILD") &&
      (member as GuildMember).id !== Becca.configs.ownerId
    ) {
      await interaction.reply({
        content: getRandomValue(Becca.responses.noPermission),
      });
      return;
    }

    const BeccaMember = guild.me;

    if (!BeccaMember) {
      await interaction.editReply({
        content: "I cannot seem to find my membership record.",
      });
      return;
    }

    const hasChannelPerms = await validateChannelPerms(
      Becca,
      BeccaMember,
      channel
    );
    const hasGuildPerms = await validateServerPerms(
      Becca,
      BeccaMember,
      channel
    );

    const areValid = hasChannelPerms && hasGuildPerms;

    const descriptionString = areValid
      ? "I seem to have an adequate level of access here."
      : "I cannot seem to get to everything I need. You should fix that.";

    const validEmbed = new MessageEmbed();
    validEmbed.setTitle(areValid ? "All good!" : "Uh oh...");
    validEmbed.setDescription(descriptionString);
    validEmbed.setColor(areValid ? Becca.colours.success : Becca.colours.error);
    validEmbed.setFooter("Like the bot? Donate: https://donate.nhcarrigan.com");

    await interaction.editReply({ embeds: [validEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "permissions command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "permissions", errorId)],
    });
  }
};
