import { CommandInteraction } from "discord.js";

import { BeccaInt } from "../BeccaInt";
import { Currency } from "../database/Currency";

/**
 * Handles the logic for the currency commands.
 *
 * @param {BeccaInt} Becca Becca's Discord instance.
 * @param {CommandInteraction} interaction The interaction payload from Discord.
 * @param {Currency} data The user's currency record from the database.
 */
export type CurrencyHandler = (
  Becca: BeccaInt,
  interaction: CommandInteraction,
  data: Currency
) => Promise<void>;
