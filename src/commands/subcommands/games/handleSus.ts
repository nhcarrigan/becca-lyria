/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { SusList } from "../../../config/commands/susList";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Generates an embed with a random colour from Among Us, and delcares that
 * colour the new sus.
 */
export const handleSus: CommandHandler = async (Becca, interaction, t) => {
  try {
    const susData = getRandomValue(SusList);
    const susEmbed = new MessageEmbed();
    susEmbed.setTitle(t("commands:games.sus.title"));
    susEmbed.setDescription(
      t("commands:games.sus.description", { color: susData.name })
    );
    susEmbed.setColor(susData.colour);
    susEmbed.setTimestamp();
    susEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
    });

    await interaction.editReply({ embeds: [susEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "sus command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "sus", errorId, t)],
    });
  }
};
