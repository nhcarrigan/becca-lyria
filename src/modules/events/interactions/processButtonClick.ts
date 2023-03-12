import { ButtonInteraction, Message } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { logActivity } from "../../commands/logActivity";
import { reactionButtonClick } from "../reactionButtonClick";

import { buttonIsPoll } from "./buttons/buttonIsPoll";
import { buttonIsTicketClaim } from "./buttons/buttonIsTicketClaim";
import { buttonIsTicketClose } from "./buttons/buttonIsTicketClose";

/**
 * Handles the logic for button clicks.
 *
 * @param {BeccaLyria} Becca Becca's discord instance.
 * @param {ButtonInteraction} interaction The interaction payload from Discord.
 * @param {TFunction} t Translation function.
 */
export const processButtonClick = async (
  Becca: BeccaLyria,
  interaction: ButtonInteraction,
  t: TFunction
) => {
  try {
    await logActivity(Becca, interaction.user.id, "button");
    if (interaction.customId === "delete-bookmark") {
      await (interaction.message as Message).delete();
    }
    if (interaction.customId.startsWith("rr-")) {
      await interaction.deferReply({ ephemeral: true });
      await reactionButtonClick(Becca, t, interaction);
    }

    if (interaction.customId.startsWith("poll-")) {
      await buttonIsPoll(Becca, interaction, t);
    }

    if (interaction.customId === "ticket-claim") {
      await buttonIsTicketClaim(Becca, interaction);
    }

    if (interaction.customId === "ticket-close") {
      await buttonIsTicketClose(Becca, interaction, t);
    }
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "process button click",
      err,
      interaction.guild?.name
    );
  }
};
