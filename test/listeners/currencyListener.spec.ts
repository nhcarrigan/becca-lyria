import { assert } from "chai";

import { currencyListener } from "../../src/listeners/currencyListener";

suite("currencyListener", () => {
  test("is defined", () => {
    assert.isDefined(currencyListener, "currencyListener is not defined");
    assert.isDefined(
      currencyListener.name,
      "currencyListener.name is not defined"
    );
    assert.isString(
      currencyListener.name,
      "currencyListener.name is not a string"
    );
    assert.isDefined(
      currencyListener.description,
      "currencyListener.description is not defined"
    );
    assert.isString(
      currencyListener.description,
      "currencyListener.description is not a string"
    );
    assert.isDefined(
      currencyListener.run,
      "currencyListener.run is not defined"
    );
    assert.isFunction(
      currencyListener.run,
      "currencyListener.run is not a function"
    );
  });
});
