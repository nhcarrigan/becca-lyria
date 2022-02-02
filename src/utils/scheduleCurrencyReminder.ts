import { BeccaLyria } from "../interfaces/BeccaLyria";

import { beccaErrorHandler } from "./beccaErrorHandler";

/**
 * Schedules a reminder to be sent to the currency webhook letting
 * a user know when it is time to claim their rewards again.
 *
 * @param {BeccaLyria} Becca Becca's discord instance.
 * @param {number} duration The delay to wait before sending the reminder.
 * @param {string} message The reminder to send.
 */
export const scheduleCurrencyReminder = async (
  Becca: BeccaLyria,
  duration: number,
  message: string
) => {
  try {
    setTimeout(async () => {
      await Becca.currencyReminderHook.send(message);
    }, duration);
  } catch (err) {
    await beccaErrorHandler(Becca, "send currency reminder", err);
  }
};
