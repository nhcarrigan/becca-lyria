/* eslint-disable jsdoc/require-param */
import { EmbedBuilder, GuildMember, PermissionFlagsBits } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { validateChannelPerms } from "../../../modules/commands/server/validateChannelPerms";
import { validateServerPerms } from "../../../modules/commands/server/validateServerPerms";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Validates that Becca has the correct permissions in the server and the
 * specific channel.
 */
export const handlePermissions: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const { channel, guild, member } = interaction;

    if (!guild || !member || !channel) {
      await interaction.editReply({
        content: getRandomValue(t<string, string[]>("responses:missingGuild")),
      });
      return;
    }

    if (
      !(member as GuildMember).permissions.has(
        PermissionFlagsBits.ManageGuild
      ) &&
      (member as GuildMember).id !== Becca.configs.ownerId
    ) {
      await interaction.reply({
        content: getRandomValue(t<string, string[]>("responses:noPermission")),
      });
      return;
    }

    const BeccaMember =
      guild.members.cache.get(Becca.user?.id || "oops") ||
      (await guild.members.fetch(Becca.user?.id || "oops"));

    if (!BeccaMember) {
      await interaction.editReply({
        content: t<string, string>("commands:misc.permissions.missing"),
      });
      return;
    }

    const hasChannelPerms = await validateChannelPerms(
      Becca,
      t,
      BeccaMember,
      channel
    );
    const hasGuildPerms = await validateServerPerms(
      Becca,
      t,
      BeccaMember,
      channel
    );

    const areValid = hasChannelPerms && hasGuildPerms;

    const descriptionString = areValid
      ? t<string, string>("commands:misc.permissions.valid")
      : t<string, string>("commands:misc.permissions.invalid");

    const validEmbed = new EmbedBuilder();
    validEmbed.setTitle(
      areValid
        ? t<string, string>("commands:misc.permissions.yes")
        : t<string, string>("commands:misc.permissions.no")
    );
    validEmbed.setDescription(descriptionString);
    validEmbed.setColor(areValid ? Becca.colours.success : Becca.colours.error);
    validEmbed.setFooter({
      text: t<string, string>("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

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
      embeds: [errorEmbedGenerator(Becca, "permissions", errorId, t)],
    });
  }
};
