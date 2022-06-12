import { assert } from "chai";

import { reactionButtonClick } from "../../src/modules/events/reactionButtonClick";
import { runNaomiCommands } from "../../src/modules/events/runNaomiCommands";

suite("reactionButtonClick", () => {
  test("is defined", () => {
    assert.isDefined(reactionButtonClick, "reactionButtonClick is not defined");
    assert.isFunction(
      reactionButtonClick,
      "reactionButtonClick is not a function"
    );
  });
});

suite("runNaomiCommands", () => {
  test("is defined", () => {
    assert.isDefined(runNaomiCommands, "runNaomiCommands is not defined");
    assert.isFunction(runNaomiCommands, "runNaomiCommands is not a function");
  });
});
