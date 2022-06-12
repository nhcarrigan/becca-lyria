import { assert } from "chai";

import { loadCommands } from "../../src/utils/loadCommands";

suite("loadCommands", () => {
  test("is defined", () => {
    assert.isDefined(loadCommands, "loadCommands is not defined");
    assert.isFunction(loadCommands, "loadCommands is not a function");
  });
});
