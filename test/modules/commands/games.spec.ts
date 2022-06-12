import { assert } from "chai";

import { generateHabiticaAchievements } from "../../../src/modules/commands/games/generateHabiticaAchievements";
import { generateHabiticaUser } from "../../../src/modules/commands/games/generateHabiticaUser";

suite("generateHabiticaAchievements", () => {
  test("is defined", () => {
    assert.isDefined(
      generateHabiticaAchievements,
      "generateHabiticaAchievements is not defined"
    );
    assert.isFunction(
      generateHabiticaAchievements,
      "generateHabiticaAchievements is not a function"
    );
  });
});

suite("generateHabiticaUser", () => {
  test("is defined", () => {
    assert.isDefined(
      generateHabiticaUser,
      "generateHabiticaUser is not defined"
    );
    assert.isFunction(
      generateHabiticaUser,
      "generateHabiticaUser is not a function"
    );
  });
});
