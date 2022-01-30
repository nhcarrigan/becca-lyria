import { BeccaLyria } from "../interfaces/BeccaLyria";

/**
 * Grabs the user's language code from an interaction, falls back to the
 * guild language code, then falls back to en-GB.
 *
 * @param {BeccaLyria} Becca Becca's discord instance.
 * @param {string} userId The receiver's discord user ID.
 * @param {number} duration The duration to timeout for.
 * @param {string} message The message to send to the user.
 */
export const scheduleCurrencyReminder = (
  Becca: BeccaLyria,
  userId: string,
  duration: number,
  message: string
) => {
  setTimeout(async () => {
    await Becca.currencyReminderHook.send(message);
  }, duration);
};
