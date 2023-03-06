/* eslint-disable jsdoc/require-param */
import { EmbedBuilder, PermissionFlagsBits } from "discord.js";

import { SettingsPermissions } from "../../../config/commands/settingsPermissions";
import { SettingsHandler } from "../../../interfaces/settings/SettingsHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { renderSetting } from "../../../modules/settings/renderSetting";
import { setSetting } from "../../../modules/settings/setSetting";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Provided the `value` is valid, sets the given `setting` to that `value`.
 */
export const handleSet: SettingsHandler = async (
  Becca,
  interaction,
  t,
  config,
  setting,
  value
) => {
  try {
    const { guild } = interaction;

    if (!guild) {
      await interaction.editReply({
        content: getRandomValue(t<string, string[]>("responses:missingGuild")),
      });
      return;
    }

    const needsPerms = SettingsPermissions[setting];
    const isNotChannel = needsPerms?.includes("ManageRoles");
    const beccaUser = await guild.members.fetchMe();

    if (
      isNotChannel &&
      needsPerms &&
      !needsPerms.every((perm) =>
        beccaUser.permissions.has(PermissionFlagsBits[perm])
      )
    ) {
      await interaction.editReply({
        content: t<string, string>("commands:config.set.noPerms", {
          permission: needsPerms.join(", "),
        }),
      });
      return;
    }

    if (needsPerms) {
      const channel = await guild.channels.fetch(value).catch(() => null);
      if (!channel) {
        await interaction.editReply({
          content: t<string, string>("commands:config.set.invalid", {
            setting,
            value,
          }),
        });
        return;
      }

      if (
        !needsPerms.every((perm) =>
          beccaUser.permissionsIn(channel).has(PermissionFlagsBits[perm])
        )
      ) {
        await interaction.editReply({
          content: t<string, string>("commands:config.set.noChannelPerms", {
            permission: needsPerms.join(", "),
            channel: channel.name,
          }),
        });
        return;
      }
    }

    const isSet = await setSetting(Becca, guild.name, setting, value, config);

    if (!isSet) {
      await interaction.editReply(
        t<string, string>("commands:config.set.failed")
      );
      return;
    }
    const newContent = isSet[setting];
    const parsedContent = renderSetting(Becca, setting, newContent);
    const successEmbed = new EmbedBuilder();
    successEmbed.setTitle(
      t<string, string>("commands:config.set.title", { setting })
    );
    successEmbed.setDescription(customSubstring(parsedContent, 2000));
    successEmbed.setTimestamp();
    successEmbed.setColor(Becca.colours.default);
    successEmbed.setFooter({
      text: t<string, string>("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });
    await interaction.editReply({ embeds: [successEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "set command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "set", errorId, t)],
    });
  }
};
