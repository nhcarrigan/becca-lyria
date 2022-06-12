import { assert } from "chai";

import { BeccaLyria } from "../../src/interfaces/BeccaLyria";
import { loadContexts } from "../../src/utils/loadContexts";
import { ContextNames } from "../__mocks__/statics";

suite("loadContexts", () => {
  test("is defined", () => {
    assert.isDefined(loadContexts, "loadContexts is not defined");
    assert.isFunction(loadContexts, "loadContexts is not a function");
  });

  test("returns array of commands", async () => {
    const result = await loadContexts({} as BeccaLyria);
    assert.isArray(result, "loadContexts did not return an array");
  });

  test("returns the expected command list", async () => {
    const result = await loadContexts({} as BeccaLyria);
    assert.equal(
      result.length,
      3,
      "does not return the expected number of commands"
    );
    const names = result.map((el) => el.data.name);
    assert.deepEqual(names, ContextNames, "does not return the expected list");
  });
});
