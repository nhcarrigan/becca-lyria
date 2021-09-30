/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Generates an embed with a link to Becca's profile site, where users
 * can read about her adventures.
 */
export const handleProfile: CommandHandler = async (Becca, interaction) => {
  try {
    const profileEmbed = new MessageEmbed();
    profileEmbed.setColor(Becca.colours.default);
    profileEmbed.setTitle("Becca Lyria");
    profileEmbed.setDescription(
      "If you want to read about my adventures, check my [profile site](https://www.beccalyria.com). I would rather not have to recount them all here."
    );
    profileEmbed.setThumbnail(Becca.user?.avatarURL({ dynamic: true }) || "");
    await interaction.editReply({ embeds: [profileEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "becca command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "becca", errorId)],
        ephemeral: true,
      })
      .catch(
        async () =>
          await interaction.editReply({
            embeds: [errorEmbedGenerator(Becca, "becca", errorId)],
          })
      );
  }
};
