import { assert } from "chai";

import { handleReset } from "../../src/commands/subcommands/config/handleReset";
import { handleSet } from "../../src/commands/subcommands/config/handleSet";
import { handleView } from "../../src/commands/subcommands/config/handleView";
import { viewSettingsArray } from "../../src/commands/subcommands/config/viewSettingsArray";

suite("handleReset", () => {
  test("is defined", () => {
    assert.isDefined(handleReset, "handleReset is not defined");
    assert.isFunction(handleReset, "handleReset is not a function");
  });
});

suite("handleSet", () => {
  test("is defined", () => {
    assert.isDefined(handleSet, "handleSet is not defined");
    assert.isFunction(handleSet, "handleSet is not a function");
  });
});

suite("handleView", () => {
  test("is defined", () => {
    assert.isDefined(handleView, "handleView is not defined");
    assert.isFunction(handleView, "handleView is not a function");
  });
});

suite("viewSettingsArray", () => {
  test("is defined", () => {
    assert.isDefined(viewSettingsArray, "viewSettingsArray is not defined");
    assert.isFunction(viewSettingsArray, "viewSettingsArray is not a function");
  });
});
