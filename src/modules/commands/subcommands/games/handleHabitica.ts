/* eslint-disable jsdoc/require-param */
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";
import { generateHabiticaAchievements } from "../../games/generateHabiticaAchievements";
import { generateHabiticaUser } from "../../games/generateHabiticaUser";

/**
 * Handles fetching a user's habitica data.
 */
export const handleHabitica: CommandHandler = async (Becca, interaction, t) => {
  try {
    const id = interaction.options.getString("id", true);

    const headers = {
      "x-client": "285a3335-33b9-473f-8d80-085c04f207bc-DiscordBot",
      "x-api-user": "285a3335-33b9-473f-8d80-085c04f207bc",
      "x-api-key": Becca.configs.habiticaKey,
    };
    const habiticaEmbeds = [];
    habiticaEmbeds[0] = await generateHabiticaUser(Becca, t, id, headers);
    if (habiticaEmbeds[0].title !== t("commands:games.habitica.nouser.title")) {
      habiticaEmbeds[1] = await generateHabiticaAchievements(
        Becca,
        t,
        id,
        headers
      );
    }

    await interaction.editReply({ embeds: habiticaEmbeds });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "habitica command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "habitica", errorId, t)],
    });
  }
};
