/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { UserFlagMap } from "../../../config/commands/userInfo";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Generates an embed containing information about the given `user`, or the author.
 */
export const handleUserInfo: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { user, guild } = interaction;
    if (!guild) {
      await interaction.editReply({
        content: getRandomValue(t("responses:missingGuild")),
      });
      return;
    }

    const mentioned = interaction.options.getUser("user");

    const target = await guild.members.fetch(mentioned?.id || user.id);

    if (!target) {
      await interaction.editReply({
        content: t("commands:community.userinfo.nouser"),
      });
      return;
    }

    const flagBits = await target.user.fetchFlags();
    const flags = flagBits.toArray();

    const userEmbed = new MessageEmbed();
    userEmbed.setColor(Becca.colours.default);
    userEmbed.setTitle(target.displayName);
    userEmbed.setThumbnail(target.user.displayAvatarURL());
    userEmbed.setDescription(
      t("commands:community.userinfo.description", {
        user: `<@!${target.id}>`,
      })
    );
    userEmbed.addField(
      t("commands:community.userinfo.create"),
      new Date(target.user.createdTimestamp).toLocaleDateString(),
      true
    );
    userEmbed.addField(
      t("commands:community.userinfo.join"),
      new Date(target.joinedTimestamp || Date.now()).toLocaleDateString(),
      true
    );
    userEmbed.addField(
      t("commands:community.userinfo.username"),
      target.user.tag,
      true
    );
    userEmbed.addField(
      t("commands:community.userinfo.roles"),
      customSubstring(
        target.roles.cache.map((role) => `<@&${role.id}>`).join(" "),
        1000
      )
    );
    userEmbed.addField(
      t("commands:community.userinfo.colour"),
      target.displayHexColor,
      true
    );
    userEmbed.addField(
      t("commands:community.userinfo.nitro"),
      target.premiumSinceTimestamp
        ? `Since ${new Date(target.premiumSinceTimestamp).toLocaleDateString()}`
        : "No.",
      true
    );
    userEmbed.addField(
      t("commands:community.userinfo.badges"),
      flags.map((el) => UserFlagMap[el]).join(", ") || "None"
    );
    userEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
    });

    await interaction.editReply({ embeds: [userEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "user info command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "user info", errorId, t)],
    });
  }
};
