/* eslint-disable jsdoc/require-param */
import { GuildMember, MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { validateChannelPerms } from "../../../modules/commands/server/validateChannelPerms";
import { validateServerPerms } from "../../../modules/commands/server/validateServerPerms";

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
        content: getRandomValue(t("responses:missingGuild")),
      });
      return;
    }

    if (
      !(member as GuildMember).permissions.has("MANAGE_GUILD") &&
      (member as GuildMember).id !== Becca.configs.ownerId
    ) {
      await interaction.reply({
        content: getRandomValue(t("responses:noPermission")),
      });
      return;
    }

    const BeccaMember = guild.me;

    if (!BeccaMember) {
      await interaction.editReply({
        content: t("commands:misc.permissions.missing"),
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
      ? t("commands:misc.permissions.valid")
      : t("commands:misc.permissions.invalid");

    const validEmbed = new MessageEmbed();
    validEmbed.setTitle(
      areValid
        ? t("commands:misc.permissions.yes")
        : t("commands:misc.permissions.no")
    );
    validEmbed.setDescription(descriptionString);
    validEmbed.setColor(areValid ? Becca.colours.success : Becca.colours.error);
    validEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
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
