import { assert } from "chai";

import { BeccaPhrases, BeccaSass } from "../src/config/BeccaResponses";
import { emoteChoices } from "../src/config/commands/emoteData";
import { testEmoteCount } from "../src/interfaces/database/EmoteCount";

suite("Config Validation", () => {
  suite("Becca Responses", () => {
    for (const key in BeccaPhrases) {
      const value = BeccaPhrases[key];
      test(`${key} has at least three values`, () => {
        assert(value.length >= 3, `${key} only has ${key.length} values`);
      });

      for (const response of value) {
        test(`Values should end with an emote`, () => {
          assert(
            /<:Becca[A-Z]{1}[a-z]+:[\d]{18}>$/i.test(response),
            `${response} does not end with an emote.`
          );
        });
      }
    }
  });

  suite("Becca Sass", () => {
    for (const key in BeccaSass) {
      const value = BeccaSass[key];
      test(`${key} has at least three values`, () => {
        assert(value.length >= 3, `${key} only has ${key.length} values`);
      });

      for (const response of value) {
        test(`Values should end with an emote`, () => {
          assert(
            /<:Becca[A-Z]{1}[a-z]+:[\d]{18}>$/i.test(response),
            `${response} does not end with an emote.`
          );
        });
      }
    }
  });

  suite("Emote Choices", () => {
    for (const [, value] of emoteChoices) {
      test(`${value} should be on the schema`, () => {
        assert(value in testEmoteCount, `${value} is not on the schema`);
      });
    }
  });
});
