/* eslint-disable jsdoc/require-param */
import { AxiosHeaders } from "axios";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { HabiticaRequestHeaders } from "../../../interfaces/commands/games/Habitica";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { generateHabiticaAchievements } from "../../../modules/commands/games/generateHabiticaAchievements";
import { generateHabiticaUser } from "../../../modules/commands/games/generateHabiticaUser";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Handles fetching a user's habitica data.
 */
export const handleHabitica: CommandHandler = async (Becca, interaction, t) => {
  try {
    const id = interaction.options.getString("id", true);

    const headers = new AxiosHeaders({
      "x-client": "285a3335-33b9-473f-8d80-085c04f207bc-DiscordBot",
      "x-api-user": "285a3335-33b9-473f-8d80-085c04f207bc",
      "x-api-key": Becca.configs.habiticaKey,
    }) as HabiticaRequestHeaders;

    const habiticaEmbeds = [];
    habiticaEmbeds[0] = await generateHabiticaUser(Becca, t, id, headers);
    if (
      habiticaEmbeds[0]?.data.title !==
      t("commands:games.habitica.nouser.title")
    ) {
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
