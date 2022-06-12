import { assert } from "chai";

import { handleAbout } from "../../src/commands/subcommands/currency/handleAbout";
import { handleClaim } from "../../src/commands/subcommands/currency/handleClaim";
import { handleDaily } from "../../src/commands/subcommands/currency/handleDaily";
import { handleGuess } from "../../src/commands/subcommands/currency/handleGuess";
import { handleSlots } from "../../src/commands/subcommands/currency/handleSlots";
import { handleTwentyOne } from "../../src/commands/subcommands/currency/handleTwentyOne";
import { handleView } from "../../src/commands/subcommands/currency/handleView";
import { handleWeekly } from "../../src/commands/subcommands/currency/handleWeekly";

suite("handleAbout", () => {
  test("is defined", () => {
    assert.isDefined(handleAbout, "handleAbout is not defined");
    assert.isFunction(handleAbout, "handleAbout is not a function");
  });
});

suite("handleClaim", () => {
  test("is defined", () => {
    assert.isDefined(handleClaim, "handleClaim is not defined");
    assert.isFunction(handleClaim, "handleClaim is not a function");
  });
});

suite("handleDaily", () => {
  test("is defined", () => {
    assert.isDefined(handleDaily, "handleDaily is not defined");
    assert.isFunction(handleDaily, "handleDaily is not a function");
  });
});

suite("handleGuess", () => {
  test("is defined", () => {
    assert.isDefined(handleGuess, "handleGuess is not defined");
    assert.isFunction(handleGuess, "handleGuess is not a function");
  });
});

suite("handleSlots", () => {
  test("is defined", () => {
    assert.isDefined(handleSlots, "handleSlots is not defined");
    assert.isFunction(handleSlots, "handleSlots is not a function");
  });
});

suite("handleTwentyOne", () => {
  test("is defined", () => {
    assert.isDefined(handleTwentyOne, "handleTwentyOne is not defined");
    assert.isFunction(handleTwentyOne, "handleTwentyOne is not a function");
  });
});

suite("handleView", () => {
  test("is defined", () => {
    assert.isDefined(handleView, "handleView is not defined");
    assert.isFunction(handleView, "handleView is not a function");
  });
});

suite("handleWeekly", () => {
  test("is defined", () => {
    assert.isDefined(handleWeekly, "handleWeekly is not defined");
    assert.isFunction(handleWeekly, "handleWeekly is not a function");
  });
});
