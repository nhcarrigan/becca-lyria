/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Returns a link to the privacy policy.
 */
export const handlePrivacy: CommandHandler = async (Becca, interaction) => {
  try {
    const privacyEmbed = new MessageEmbed();
    privacyEmbed.setTitle("I'll keep your secrets safe!");
    privacyEmbed.setDescription(
      "To maintain my functionality, I need to collect quite a bit of data. Mostly, this data is user/server IDs, names, and avatars.\n\nI will never store your message content in my database, but it may be logged in this server if the admins have enabled it.\n\nIf you want a full breakdown of everything I collect, [view my privacy policy](https://docs.beccalyria.com/#/privacy-policy)."
    );
    privacyEmbed.setFooter(
      "Like the bot? Donate: https://donate.nhcarrigan.com",
      "https://cdn.nhcarrigan.com/profile-transparent.png"
    );

    await interaction.editReply({ embeds: [privacyEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "privacy command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "privacy", errorId)],
    });
  }
};
