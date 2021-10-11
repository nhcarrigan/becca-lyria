import { assert } from "chai";

import {
  configChoices,
  configViewChoices,
} from "../src/config/commands/settingsChoices";
import { defaultServer } from "../src/config/database/defaultServer";
import { testServerConfig } from "../src/interfaces/database/ServerConfig";

suite("Validate Settings", () => {
  suite("Default Server", () => {
    for (const key in defaultServer) {
      test(`${key} should be present on schema`, () => {
        assert(key in testServerConfig, `Missing ${key} from server schema.`);
      });
    }
  });

  suite("Config Choices", () => {
    test("Config choices should be unique", () => {
      const configChoicesSet = new Set(configChoices.map((el) => el[1]));
      assert.strictEqual(configChoicesSet.size, configChoices.length);
    });

    test("Config View choices should be unique", () => {
      const configViewChoicesSet = new Set(
        configViewChoices.map((el) => el[1])
      );
      assert.strictEqual(configViewChoicesSet.size, configViewChoices.length);
    });

    for (const [, choice] of configChoices) {
      test(`${choice} should be a valid config option`, () => {
        assert(
          choice in testServerConfig,
          `${choice} is not a valid config option.`
        );
      });
    }

    test("First Config View choice should be global", () => {
      assert(
        configViewChoices[0][1] === "global",
        `First choice is not global.`
      );
    });

    for (const [, choice] of configViewChoices.slice(1)) {
      test(`${choice} should be a valid config view option`, () => {
        assert(
          choice in testServerConfig,
          `${choice} is not a valid config view option.`
        );
      });

      test(`${choice} should be an array type`, () => {
        assert(
          Array.isArray(testServerConfig[choice]),
          `${choice} is not an array.`
        );
      });
    }

    const arrays = Object.entries(testServerConfig)
      .filter((el) => Array.isArray(el[1]))
      .map((el) => el[0]);
    for (const name of arrays) {
      test(`${name} should be included in Config View choices`, () => {
        assert(
          configViewChoices.find((el) => el[1] === name),
          `${name} is not in Config View choices.`
        );
      });
    }
  });
});
