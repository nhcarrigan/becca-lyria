/* eslint-disable jsdoc/require-param */
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";
import { generateHabiticaAchievements } from "../../games/generateHabiticaAchievements";
import { generateHabiticaUser } from "../../games/generateHabiticaUser";

/**
 * Handles fetching a user's habitica data.
 */
export const handleHabitica: CommandHandler = async (Becca, interaction) => {
  try {
    const id = interaction.options.getString("id", true);

    const headers = {
      "x-client": "285a3335-33b9-473f-8d80-085c04f207bc-DiscordBot",
      "x-api-user": "285a3335-33b9-473f-8d80-085c04f207bc",
      "x-api-key": Becca.configs.habiticaKey,
    };

    const userEmbed = await generateHabiticaUser(Becca, id, headers);
    const achievementEmbed = await generateHabiticaAchievements(
      Becca,
      id,
      headers
    );

    await interaction.editReply({ embeds: [userEmbed, achievementEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "habitica command",
      err,
      interaction.guild?.name
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "habitica", errorId)],
    });
  }
};
