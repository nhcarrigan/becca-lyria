import { assert } from "chai";

import { handleLogReset } from "../../src/commands/subcommands/log/handleLogReset";
import { handleLogSet } from "../../src/commands/subcommands/log/handleLogSet";
import { handleLogView } from "../../src/commands/subcommands/log/handleLogView";

suite("handleLogReset", () => {
  test("is defined", () => {
    assert.isDefined(handleLogReset, "handleLogReset is not defined");
    assert.isFunction(handleLogReset, "handleLogReset is not a function");
  });
});

suite("handleLogSet", () => {
  test("is defined", () => {
    assert.isDefined(handleLogSet, "handleLogSet is not defined");
    assert.isFunction(handleLogSet, "handleLogSet is not a function");
  });
});

suite("handleLogView", () => {
  test("is defined", () => {
    assert.isDefined(handleLogView, "handleLogView is not defined");
    assert.isFunction(handleLogView, "handleLogView is not a function");
  });
});
