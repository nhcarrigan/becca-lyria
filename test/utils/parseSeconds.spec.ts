import { assert } from "chai";

import { parseSeconds } from "../../src/utils/parseSeconds";

suite("parseSeconds", () => {
  test("is defined", () => {
    assert.isDefined(parseSeconds, "parseSeconds is not defined");
    assert.isFunction(parseSeconds, "parseSeconds is not a function");
  });
});
