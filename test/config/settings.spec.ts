import { assert } from "chai";

import {
  automodChoices,
  automodToggleChoices,
  automodViewChoices,
  configChoices,
  configViewChoices,
  logChoices,
} from "../../src/config/commands/settingsChoices";
import { defaultServer } from "../../src/config/database/defaultServer";
import { testServerConfig } from "../../src/interfaces/database/ServerConfig";

suite("Validate Settings", () => {
  suite("Default Server", () => {
    for (const key in defaultServer) {
      test(`${key} should be present on schema`, () => {
        assert(key in testServerConfig, `Missing ${key} from server schema.`);
      });
    }

    for (const key in testServerConfig) {
      test(`${key} should be present on default server`, () => {
        if (key === "serverID" || key === "serverName") {
          assert(true);
          return;
        }
        assert(key in defaultServer, `Missing ${key} from default server.`);
      });
    }
  });

  suite("Config Choices", () => {
    test("Config choices should be unique", () => {
      const configChoicesSet = new Set(configChoices.map((el) => el.value));
      assert.strictEqual(configChoicesSet.size, configChoices.length);
    });

    test("Config View choices should be unique", () => {
      const configViewChoicesSet = new Set(
        configViewChoices.map((el) => el.value)
      );
      assert.strictEqual(configViewChoicesSet.size, configViewChoices.length);
    });

    for (const { value: choice } of configChoices) {
      test(`${choice} should be a valid config option`, () => {
        assert(
          choice in testServerConfig,
          `${choice} is not a valid config option.`
        );
      });
    }

    test("First Config View choice should be global", () => {
      assert(
        configViewChoices[0].value === "global",
        `First choice is not global.`
      );
    });

    for (const { value: choice } of configViewChoices.slice(1)) {
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
  });

  suite("Log Choices", () => {
    test("Log choices should be unique", () => {
      const logChoicesSet = new Set(logChoices.map((el) => el.value));
      assert.strictEqual(logChoicesSet.size, logChoices.length);
    });

    for (const { value: choice } of logChoices) {
      test(`${choice} should be a valid log option`, () => {
        assert(
          choice in testServerConfig,
          `${choice} is not a valid log option.`
        );
      });
    }
  });

  suite("Automod Choices", () => {
    test("Automod choices should be unique", () => {
      const automodChoicesSet = new Set(automodChoices.map((el) => el.value));
      assert.strictEqual(automodChoicesSet.size, automodChoices.length);
    });

    test("Automod View choices should be unique", () => {
      const automodViewChoicesSet = new Set(
        automodViewChoices.map((el) => el.value)
      );
      assert.strictEqual(automodViewChoicesSet.size, automodViewChoices.length);
    });

    test("Automod Toggle choices should be unique", () => {
      const automodToggleChoicesSet = new Set(
        automodToggleChoices.map((el) => el.value)
      );
      assert.strictEqual(
        automodToggleChoicesSet.size,
        automodToggleChoices.length
      );
    });

    for (const { value: choice } of automodChoices) {
      test(`${choice} should be a valid automod option`, () => {
        assert(
          choice in testServerConfig,
          `${choice} is not a valid automod option.`
        );
      });
    }

    test("First Automod View choice should be global", () => {
      assert(
        automodViewChoices[0].value === "global",
        `First choice is not global.`
      );
    });

    for (const { value: choice } of automodViewChoices.slice(1)) {
      test(`${choice} should be a valid automod view option`, () => {
        assert(
          choice in testServerConfig,
          `${choice} is not a valid automod view option.`
        );
      });

      test(`${choice} should be an array type`, () => {
        assert(
          Array.isArray(testServerConfig[choice]),
          `${choice} is not an array.`
        );
      });
    }

    for (const { value: choice } of automodToggleChoices) {
      test(`${choice} should be a valid automod toggle option`, () => {
        assert(
          choice in testServerConfig,
          `${choice} is not a valid automod toggle option.`
        );
      });
    }
  });
});
