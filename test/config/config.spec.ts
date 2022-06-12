import { assert } from "chai";

import { emoteChoices } from "../../src/config/commands/emoteData";
import { testEmoteCount } from "../../src/interfaces/database/EmoteCount";

suite("Config Validation", () => {
  suite("Emote Choices", () => {
    for (const { value } of emoteChoices) {
      test(`${value} should be on the schema`, () => {
        assert(value in testEmoteCount, `${value} is not on the schema`);
      });
    }
  });
});
