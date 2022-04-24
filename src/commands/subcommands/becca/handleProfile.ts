/* eslint-disable jsdoc/require-param */
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";

/**
 * Generates an embed with a link to Becca's profile site, where users
 * can read about her adventures.
 */
export const handleProfile: CommandHandler = async (Becca, interaction, t) => {
  try {
    const profileEmbed = new MessageEmbed();
    profileEmbed.setColor(Becca.colours.default);
    profileEmbed.setTitle(t("commands:becca.profile.title"));
    profileEmbed.setDescription(t("commands:becca.profile.description"));
    profileEmbed.setThumbnail(Becca.user?.avatarURL({ dynamic: true }) || "");
    profileEmbed.setFooter(
      "Like the bot? Donate: https://donate.nhcarrigan.com",
      "https://cdn.nhcarrigan.com/profile-transparent.png"
    );

    const profileButton = new MessageButton()
      .setLabel(t("commands:becca.profile.buttons.view"))
      .setEmoji("<:BeccaHello:867102882791424073>")
      .setStyle("LINK")
      .setURL(
        "https://www.beccalyria.com?utm_source=discord&utm_medium=profile-command"
      );

    const row = new MessageActionRow().addComponents([profileButton]);

    await interaction.editReply({ embeds: [profileEmbed], components: [row] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "profile command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "profile", errorId, t)],
    });
  }
};
