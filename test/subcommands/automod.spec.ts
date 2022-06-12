import { assert } from "chai";

import { handleAutomodAntiphish } from "../../src/commands/subcommands/automod/handleAutomodAntiphish";
import { handleAutomodReset } from "../../src/commands/subcommands/automod/handleAutomodReset";
import { handleAutomodSet } from "../../src/commands/subcommands/automod/handleAutomodSet";
import { handleAutomodView } from "../../src/commands/subcommands/automod/handleAutomodView";

suite("handleAutomodAntiphish", () => {
  test("is defined", () => {
    assert.isDefined(
      handleAutomodAntiphish,
      "handleAutomodAntiphish is not defined"
    );
    assert.isFunction(
      handleAutomodAntiphish,
      "handleAutomodAntiphish is not a function"
    );
  });
});

suite("handleAutomodReset", () => {
  test("is defined", () => {
    assert.isDefined(handleAutomodReset, "handleAutomodReset is not defined");
    assert.isFunction(
      handleAutomodReset,
      "handleAutomodReset is not a function"
    );
  });
});

suite("handleAutomodSet", () => {
  test("is defined", () => {
    assert.isDefined(handleAutomodSet, "handleAutomodSet is not defined");
    assert.isFunction(handleAutomodSet, "handleAutomodSet is not a function");
  });
});

suite("handleAutomodView", () => {
  test("is defined", () => {
    assert.isDefined(handleAutomodView, "handleAutomodView is not defined");
    assert.isFunction(handleAutomodView, "handleAutomodView is not a function");
  });
});
