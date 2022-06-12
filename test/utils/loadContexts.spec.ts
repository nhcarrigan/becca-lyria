import { assert } from "chai";

import { loadContexts } from "../../src/utils/loadContexts";

suite("loadContexts", () => {
  test("is defined", () => {
    assert.isDefined(loadContexts, "loadContexts is not defined");
    assert.isFunction(loadContexts, "loadContexts is not a function");
  });
});
