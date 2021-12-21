/* eslint-disable jsdoc/require-param */
/* eslint-disable */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../../utils/customSubstring";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";
import { sendLogEmbed } from "../../../guild/sendLogEmbed";

/**
 * If the server has configured a muted role, applies that role to the `target`
 * user for the given `reason`.
 */
export const handleMute: CommandHandler = async (
  Becca,
  interaction,
  config
) => {
  try {
    await interaction.editReply({
      content:
        "The mute/unmute functionality is temporarily removed, pending library support for Discord's new timeout feature.",
    });
    // const { guild, member } = interaction;
    // const target = interaction.options.getUser("target", true);
    // const reason = interaction.options.getString("reason", true);

    // if (!guild) {
    //   await interaction.editReply({
    //     content: getRandomValue(Becca.responses.missingGuild),
    //   });
    //   return;
    // }

    // if (
    //   !member ||
    //   typeof member.permissions === "string" ||
    //   !member.permissions.has("KICK_MEMBERS")
    // ) {
    //   await interaction.editReply({
    //     content: getRandomValue(Becca.responses.noPermission),
    //   });
    //   return;
    // }

    // if (target.id === member.user.id) {
    //   await interaction.editReply({
    //     content: getRandomValue(Becca.responses.noModSelf),
    //   });
    //   return;
    // }
    // if (target.id === Becca.user?.id) {
    //   await interaction.editReply({
    //     content: getRandomValue(Becca.responses.noModBecca),
    //   });
    //   return;
    // }

    // const targetUser = await guild.members.fetch(target.id);

    // const muteEmbed = new MessageEmbed();
    // muteEmbed.setTitle("A user has been silenced!");
    // muteEmbed.setDescription(`They were silenced by ${member.user.username}`);
    // muteEmbed.setColor(Becca.colours.warning);
    // muteEmbed.addField("Reason", customSubstring(reason, 1000));
    // muteEmbed.setFooter(`ID: ${targetUser.id}`);
    // muteEmbed.setTimestamp();
    // muteEmbed.setAuthor(
    //   `${targetUser.user.username}#${targetUser.user.discriminator}`,
    //   targetUser.user.displayAvatarURL()
    // );

    // await sendLogEmbed(Becca, guild, muteEmbed, "moderation_events");

    // await interaction.editReply({
    //   content: "That user has been cursed with silence.",
    // });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "mute command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "mute", errorId)],
    });
  }
};
