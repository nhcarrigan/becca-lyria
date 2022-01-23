import { CommandInteraction } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../BeccaLyria";
import { Currency } from "../database/Currency";

/**
 * Handles the logic for the currency commands.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {CommandInteraction} interaction The interaction payload from Discord.
 * @param {TFunction} t The i18n translation function.
 * @param {Currency} data The user's currency record from the database.
 */
export type CurrencyHandler = (
  Becca: BeccaLyria,
  interaction: CommandInteraction,
  t: TFunction,
  data: Currency
) => Promise<void>;
