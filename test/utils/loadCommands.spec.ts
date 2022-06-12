import { assert } from "chai";

import { BeccaLyria } from "../../src/interfaces/BeccaLyria";
import { loadCommands } from "../../src/utils/loadCommands";

suite("loadCommands", () => {
  test("is defined", () => {
    assert.isDefined(loadCommands, "loadCommands is not defined");
    assert.isFunction(loadCommands, "loadCommands is not a function");
  });

  test("returns array of commands", async () => {
    const result = await loadCommands({} as BeccaLyria);
    assert.isArray(result, "loadCommands did not return an array");
  });
});
