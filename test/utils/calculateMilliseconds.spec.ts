import { assert } from "chai";

import { calculateMilliseconds } from "../../src/utils/calculateMilliseconds";

suite("calculateMilliseconds", () => {
  test("is defined", () => {
    assert.isDefined(
      calculateMilliseconds,
      "calculateMilliseconds is not defined"
    );
    assert.isFunction(
      calculateMilliseconds,
      "calculateMilliseconds is not a function"
    );
  });
});
