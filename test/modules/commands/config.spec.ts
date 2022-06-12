import { assert } from "chai";

import { viewSettings } from "../../../src/modules/commands/config/viewSettings";

suite("viewSettings", () => {
  test("is defined", () => {
    assert.isDefined(viewSettings, "viewSettings is not defined");
    assert.isFunction(viewSettings, "viewSettings is not a function");
  });
});
