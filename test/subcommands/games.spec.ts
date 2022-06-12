import { assert } from "chai";

import { handleFact } from "../../src/commands/subcommands/games/handleFact";
import { handleHabitica } from "../../src/commands/subcommands/games/handleHabitica";
import { handleJoke } from "../../src/commands/subcommands/games/handleJoke";
import { handleMtg } from "../../src/commands/subcommands/games/handleMtg";
import { handleQuote } from "../../src/commands/subcommands/games/handleQuote";
import { handleSlime } from "../../src/commands/subcommands/games/handleSlime";
import { handleSus } from "../../src/commands/subcommands/games/handleSus";
import { handleTrivia } from "../../src/commands/subcommands/games/handleTrivia";

suite("handleFact", () => {
  test("is defined", () => {
    assert.isDefined(handleFact, "handleFact is not defined");
    assert.isFunction(handleFact, "handleFact is not a function");
  });
});

suite("handleHabitica", () => {
  test("is defined", () => {
    assert.isDefined(handleHabitica, "handleHabitica is not defined");
    assert.isFunction(handleHabitica, "handleHabitica is not a function");
  });
});

suite("handleJoke", () => {
  test("is defined", () => {
    assert.isDefined(handleJoke, "handleJoke is not defined");
    assert.isFunction(handleJoke, "handleJoke is not a function");
  });
});

suite("handleMtg", () => {
  test("is defined", () => {
    assert.isDefined(handleMtg, "handleMtg is not defined");
    assert.isFunction(handleMtg, "handleMtg is not a function");
  });
});

suite("handleQuote", () => {
  test("is defined", () => {
    assert.isDefined(handleQuote, "handleQuote is not defined");
    assert.isFunction(handleQuote, "handleQuote is not a function");
  });
});

suite("handleSlime", () => {
  test("is defined", () => {
    assert.isDefined(handleSlime, "handleSlime is not defined");
    assert.isFunction(handleSlime, "handleSlime is not a function");
  });
});

suite("handleSus", () => {
  test("is defined", () => {
    assert.isDefined(handleSus, "handleSus is not defined");
    assert.isFunction(handleSus, "handleSus is not a function");
  });
});

suite("handleTrivia", () => {
  test("is defined", () => {
    assert.isDefined(handleTrivia, "handleTrivia is not defined");
    assert.isFunction(handleTrivia, "handleTrivia is not a function");
  });
});
