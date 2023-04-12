/* eslint-disable jsdoc/require-param */
import { DefaultTFuncReturn } from "i18next";

import { CommandHandler } from "../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { getRandomValue } from "../../utils/getRandomValue";

/**
 * This handles a case where a proper subcommand handler isn't found.
 */
export const handleInvalidSubcommand: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    await interaction.editReply({
      content: getRandomValue(
        t<string, DefaultTFuncReturn & string[]>("responses:invalidCommand")
      ),
    });
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "invalid subcommand",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
  }
};
