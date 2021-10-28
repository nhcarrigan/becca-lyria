/* eslint-disable jsdoc/require-param */
import { GuildMember } from "discord.js";

import { slimeList } from "../../../../config/commands/slimeList";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Generates a random slime-themed name from the slimeList and assigns it
 * as the user's nickname.
 */
export const handleSlime: CommandHandler = async (Becca, interaction) => {
  try {
    const member = interaction.member as GuildMember;

    if (!member) {
      await interaction.editReply({
        content: getRandomValue(Becca.responses.missingGuild),
      });
      return;
    }

    const index = Math.floor(Math.random() * slimeList.length);
    const noun = slimeList[index];

    await member
      .setNickname(`${noun}slime`)
      .then(async () => {
        await interaction.editReply("You've been slimed!");
      })
      .catch(async () => {
        await interaction.editReply(
          "I lack the permission to bequeath you a new name."
        );
      });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "slime command",
      err,
      interaction.guild?.name
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "slime", errorId)],
    });
  }
};
