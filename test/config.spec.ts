import { assert } from "chai";

import { BeccaPhrases, BeccaSass } from "../src/config/BeccaResponses";

suite("Config Validation", () => {
  suite("Becca Responses", () => {
    for (const key in BeccaPhrases) {
      const value = BeccaPhrases[key];
      test(`${key} has at least three values`, () => {
        assert(value.length >= 3, `${key} only has ${key.length} values`);
      });
    }
  });

  suite("Becca Sass", () => {
    for (const key in BeccaSass) {
      const value = BeccaSass[key];
      test(`${key} has at least three values`, () => {
        assert(value.length >= 3, `${key} only has ${key.length} values`);
      });
    }
  });
});
