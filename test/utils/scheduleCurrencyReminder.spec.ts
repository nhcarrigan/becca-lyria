import { assert } from "chai";

import { BeccaLyria } from "../../src/interfaces/BeccaLyria";
import { scheduleCurrencyReminder } from "../../src/utils/scheduleCurrencyReminder";
import { sleep } from "../../src/utils/sleep";

suite("scheduleCurrencyReminder", () => {
  test("is defined", () => {
    assert.isDefined(
      scheduleCurrencyReminder,
      "scheduleCurrencyReminder is not defined"
    );
    assert.isFunction(
      scheduleCurrencyReminder,
      "scheduleCurrencyReminder is not a function"
    );
  });

  test("sends given message after specified time", async () => {
    const messages: string[] = [];
    const mockBecca = {
      currencyReminderHook: {
        send: async (message: string) =>
          await new Promise(() => messages.push(message)),
      },
    } as unknown;
    await scheduleCurrencyReminder(mockBecca as BeccaLyria, 100, "test");
    await sleep(100);
    assert.equal(messages.length, 1, "message was not sent");
    assert.equal(messages[0], "test", "correct message was not sent");
  });
});
