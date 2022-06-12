import { assert } from "chai";

import { getOrbitData } from "../../../src/modules/commands/misc/getOrbitData";

suite("getOrbitData", () => {
  test("is defined", () => {
    assert.isDefined(getOrbitData, "getOrbitData is not defined");
    assert.isFunction(getOrbitData, "getOrbitData is not a function");
  });
});
