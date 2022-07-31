import { assert } from "chai";

import ActivityModel from "../../src/database/models/ActivityModel";
import CommandCountModel from "../../src/database/models/CommandCountModel";
import CurrencyModel from "../../src/database/models/CurrencyModel";
import EmoteCountModel from "../../src/database/models/EmoteCountModel";
import HistoryModel from "../../src/database/models/HistoryModel";
import LevelModel from "../../src/database/models/LevelModel";
import OptOutModel from "../../src/database/models/OptOutModel";
import ServerConfigModel from "../../src/database/models/ServerConfigModel";
import StarModel from "../../src/database/models/StarModel";
import UsageModel from "../../src/database/models/UsageModel";
import VoterModel from "../../src/database/models/VoterModel";
import { testActivity } from "../../src/interfaces/database/Activity";
import { testCommandCount } from "../../src/interfaces/database/CommandCount";
import { testCurrency } from "../../src/interfaces/database/Currency";
import { testEmoteCount } from "../../src/interfaces/database/EmoteCount";
import { testHistory } from "../../src/interfaces/database/History";
import { testLevel } from "../../src/interfaces/database/Level";
import { testOptOut } from "../../src/interfaces/database/OptOut";
import { testServerConfig } from "../../src/interfaces/database/ServerConfig";
import { testStar } from "../../src/interfaces/database/Star";
import { testUsage } from "../../src/interfaces/database/Usage";
import { testVoter } from "../../src/interfaces/database/Voter";

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

  suite("Emote Count Model", () => {
    const testModel = new EmoteCountModel();
    for (const key in testEmoteCount) {
      test(`${key} should be in the Emote Count schema`, () => {
        assert(key in testModel, `Missing ${key} from the Emote Count schema.`);
      });
    }
  });

  suite("History Model", () => {
    const testModel = new HistoryModel();
    for (const key in testHistory) {
      test(`${key} should be in the History schema`, () => {
        assert(key in testModel, `Missing ${key} from the History schema.`);
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

  suite("Opt Out Model", () => {
    const testModel = new OptOutModel();
    for (const key in testOptOut) {
      test(`${key} should be in the Opt Out schema`, () => {
        assert(key in testModel, `Missing ${key} from the Opt Out schema.`);
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

  suite("Voter Model", () => {
    const testModel = new VoterModel();
    for (const key in testVoter) {
      test(`${key} should be in the Voter schema`, () => {
        assert(key in testModel, `Missing ${key} from the Voter schema.`);
      });
    }
  });
});
