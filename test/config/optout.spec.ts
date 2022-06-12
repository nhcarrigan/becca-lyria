import { assert } from "chai";

import { ActivityOptOut } from "../../src/config/optout/ActivityOptOut";
import { CurrencyOptOut } from "../../src/config/optout/CurrencyOptOut";
import { EmoteOptOut } from "../../src/config/optout/EmoteOptOut";
import { LevelOptOut } from "../../src/config/optout/LevelOptOut";
import { ServerCommandOptOut } from "../../src/config/optout/ServerCommandOptOut";
import { VoteOptOut } from "../../src/config/optout/VoteOptOut";

suite("ActivityOptOut", () => {
  test("is defined", () => {
    assert.isDefined(ActivityOptOut, "ActivityOptOut is not defined");
    assert.isArray(ActivityOptOut, "ActivityOptOut is not an array");
  });
});

suite("CurrencyOptOut", () => {
  test("is defined", () => {
    assert.isDefined(CurrencyOptOut, "CurrencyOptOut is not defined");
    assert.isArray(CurrencyOptOut, "CurrencyOptOut is not an array");
  });
});

suite("EmoteOptOut", () => {
  test("is defined", () => {
    assert.isDefined(EmoteOptOut, "EmoteOptOut is not defined");
    assert.isArray(EmoteOptOut, "EmoteOptOut is not an array");
  });
});

suite("LevelOptOut", () => {
  test("is defined", () => {
    assert.isDefined(LevelOptOut, "LevelOptOut is not defined");
    assert.isArray(LevelOptOut, "LevelOptOut is not an array");
  });
});

suite("ServerCommandOptOut", () => {
  test("is defined", () => {
    assert.isDefined(ServerCommandOptOut, "ServerCommandOptOut is not defined");
    assert.isArray(ServerCommandOptOut, "ServerCommandOptOut is not an array");
  });
});

suite("VoteOptOut", () => {
  test("is defined", () => {
    assert.isDefined(VoteOptOut, "VoteOptOut is not defined");
    assert.isArray(VoteOptOut, "VoteOptOut is not an array");
  });
});
