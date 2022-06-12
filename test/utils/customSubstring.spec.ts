import { assert } from "chai";

import { customSubstring } from "../../src/utils/customSubstring";

suite("customSubstring", () => {
  test("is defined", () => {
    assert.isDefined(customSubstring, "customSubstring is not defined");
    assert.isFunction(customSubstring, "customSubstring is not a function");
  });
});
