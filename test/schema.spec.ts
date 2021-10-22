import { assert } from "chai";

import ActivityModel from "../src/database/models/ActivityModel";
import CommandCountModel from "../src/database/models/CommandCountModel";
import CurrencyModel from "../src/database/models/CurrencyModel";
import LevelModel from "../src/database/models/LevelModel";
import ServerConfigModel from "../src/database/models/ServerConfigModel";
import StarModel from "../src/database/models/StarModel";
import UsageModel from "../src/database/models/UsageModel";
import WarningModel from "../src/database/models/WarningModel";
import { testActivity } from "../src/interfaces/database/Activity";
import { testCommandCount } from "../src/interfaces/database/CommandCount";
import { testCurrency } from "../src/interfaces/database/Currency";
import { testLevel } from "../src/interfaces/database/Level";
import { testServerConfig } from "../src/interfaces/database/ServerConfig";
import { testStar } from "../src/interfaces/database/Star";
import { testUsage } from "../src/interfaces/database/Usage";
import { testWarning } from "../src/interfaces/database/Warning";

suite("Schema Validation", () => {
  suite("Activity Schema", () => {
    const testModel = new ActivityModel();
    for (const key in testActivity) {
      test(`${key} should be in the Activity schema`, () => {
        assert(key in testModel, `Missing ${key} from the Activity schema.`);
      });
    }
  });

  suite("Command Count Model", () => {
    const testModel = new CommandCountModel();
    for (const key in testCommandCount) {
      test(`${key} should be in the Command Count schema`, () => {
        assert(
          key in testModel,
          `Missing ${key} from the Command Count schema.`
        );
      });
    }
  });

  suite("Currency Model", () => {
    const testModel = new CurrencyModel();
    for (const key in testCurrency) {
      test(`${key} should be in the Currency schema`, () => {
        assert(key in testModel, `Missing ${key} from the Currency schema.`);
      });
    }
  });

  suite("Level Model", () => {
    const testModel = new LevelModel();
    for (const key in testLevel) {
      test(`${key} should be in the Level schema`, () => {
        assert(key in testModel, `Missing ${key} from the Level schema.`);
      });
    }
  });

  suite("Server Config Model", () => {
    const testModel = new ServerConfigModel();
    for (const key in testServerConfig) {
      test(`${key} should be in the Server Config schema`, () => {
        assert(
          key in testModel,
          `Missing ${key} from the Server Config schema.`
        );
      });
    }
  });

  suite("Star Model", () => {
    const testModel = new StarModel();
    for (const key in testStar) {
      test(`${key} should be in the Star schema`, () => {
        assert(key in testModel, `Missing ${key} from the Star schema.`);
      });
    }
  });

  suite("Usage Model", () => {
    const testModel = new UsageModel();
    for (const key in testUsage) {
      test(`${key} should be in the Usage schema`, () => {
        assert(key in testModel, `Missing ${key} from the Usage schema.`);
      });
    }
  });

  suite("Warning Model", () => {
    const testModel = new WarningModel();
    for (const key in testWarning) {
      test(`${key} should be in the Warning schema`, () => {
        assert(key in testModel, `Missing ${key} from the Warning schema.`);
      });
    }
  });
});
