import { assert } from "chai";

import { sleep } from "../../src/utils/sleep";

suite("sleep", () => {
  test("is defined", () => {
    assert.isDefined(sleep, "sleep is not defined");
    assert.isFunction(sleep, "sleep is not a function");
  });
});
