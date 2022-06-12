import { assert } from "chai";

import { viewAutomodSettings } from "../../../src/modules/commands/automod/viewAutomodSettings";

suite("viewAutomodSettings", () => {
  test("is defined", () => {
    assert.isDefined(viewAutomodSettings, "viewAutomodSettings is not defined");
    assert.isFunction(
      viewAutomodSettings,
      "viewAutomodSettings is not a function"
    );
  });
});
