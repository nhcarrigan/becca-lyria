import { assert } from "chai";

import { scheduleCurrencyReminder } from "../../src/utils/scheduleCurrencyReminder";

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
});
