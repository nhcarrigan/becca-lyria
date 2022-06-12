import { assert } from "chai";

import { defaultHearts } from "../../src/config/listeners/defaultHearts";
import levelScale from "../../src/config/listeners/levelScale";

suite("defaultHearts", () => {
  test("is defined", () => {
    assert.isDefined(defaultHearts, "defaultHearts is not defined");
    assert.isArray(defaultHearts, "defaultHearts is not an array");
  });
});

suite("levelScale", () => {
  test("is defined", () => {
    assert.isDefined(levelScale, "levelScale is not defined");
    assert.isArray(levelScale, "levelScale is not an array");
  });
});
