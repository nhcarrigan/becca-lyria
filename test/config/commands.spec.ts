import { assert } from "chai";

import { adventureList } from "../../src/config/commands/adventureList";
import { artList } from "../../src/config/commands/artList";
import {
  emoteChoices,
  throwList,
  smackList,
} from "../../src/config/commands/emoteData";
import { httpStatus } from "../../src/config/commands/httpStatus";
import { motivationalQuotes } from "../../src/config/commands/motivationalQuotes";
import {
  accountVerificationMap,
  contentFilterMap,
} from "../../src/config/commands/serverInfo";
import {
  automodChoices,
  automodToggleChoices,
  automodViewChoices,
  configChoices,
  configViewChoices,
  logChoices,
} from "../../src/config/commands/settingsChoices";
import { slimeList } from "../../src/config/commands/slimeList";
import { slotsList } from "../../src/config/commands/slotsList";
import { SusList } from "../../src/config/commands/susList";
import { topicList } from "../../src/config/commands/topicList";
import { translatorList } from "../../src/config/commands/translatorList";
import {
  updatesSinceLastRelease,
  nextScheduledRelease,
} from "../../src/config/commands/updatesData";
import { defaultServer } from "../../src/config/database/defaultServer";
import { testEmoteCount } from "../../src/interfaces/database/EmoteCount";
import { testServerConfig } from "../../src/interfaces/database/ServerConfig";

suite("adventureList", () => {
  test("is defined", () => {
    assert.isDefined(adventureList, "adventureList is not defined");
    assert.isArray(adventureList, "adventureList is not an array");
  });
});

suite("artList", () => {
  test("is defined", () => {
    assert.isDefined(artList, "artList is not defined");
    assert.isArray(artList, "artList is not an array");
  });
});

suite("emoteData", () => {
  test("is defined", () => {
    assert.isDefined(emoteChoices, "emoteChoices is not defined");
    assert.isArray(emoteChoices, "emoteChoices is not an array");
    assert.isDefined(throwList, "throwList is not defined");
    assert.isArray(throwList, "throwList is not an array");
    assert.isDefined(smackList, "smackList is not defined");
    assert.isArray(smackList, "smackList is not an array");
  });

  suite("Emote Choices", () => {
    for (const { value } of emoteChoices) {
      test(`${value} should be on the schema`, () => {
        assert(value in testEmoteCount, `${value} is not on the schema`);
      });
    }
  });
});

suite("httpStatus", () => {
  test("is defined", () => {
    assert.isDefined(httpStatus, "httpStatus is not defined");
    assert.isArray(httpStatus, "httpStatus is not an array");
  });
});

suite("motivationalQuotes", () => {
  test("is defined", () => {
    assert.isDefined(motivationalQuotes, "motivationalQuotes is not defined");
    assert.isArray(motivationalQuotes, "motivationalQuotes is not an array");
  });
});

suite("serverInfo", () => {
  test("is defined", () => {
    assert.isDefined(
      accountVerificationMap,
      "accountVerificationMap is not defined"
    );
    assert.isObject(
      accountVerificationMap,
      "accountVerificationMap is not an object"
    );
    assert.isDefined(contentFilterMap, "contentFilterMap is not defined");
    assert.isObject(contentFilterMap, "contentFilterMap is not an object");
  });
});

suite("settingsChoices", () => {
  test("is defined", () => {
    assert.isDefined(configChoices, "configChoices is not defined");
    assert.isArray(configChoices, "configChoices is not an array");
    assert.isDefined(configViewChoices, "configViewChoices is not defined");
    assert.isArray(configViewChoices, "configViewChoices is not an array");
    assert.isDefined(automodChoices, "automodChoices is not defined");
    assert.isArray(automodChoices, "automodChoices is not an array");
    assert.isDefined(
      automodToggleChoices,
      "automodToggleChoices is not defined"
    );
    assert.isArray(
      automodToggleChoices,
      "automodToggleChoices is not an array"
    );
    assert.isDefined(automodViewChoices, "automodViewChoices is not defined");
    assert.isArray(automodViewChoices, "automodViewChoices is not an array");
    assert.isDefined(logChoices, "logChoices is not defined");
    assert.isArray(logChoices, "logChoices is not an array");
  });

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

suite("slimeList", () => {
  test("is defined", () => {
    assert.isDefined(slimeList, "slimeList is not defined");
    assert.isArray(slimeList, "slimeList is not an array");
  });
});

suite("slotsList", () => {
  test("is defined", () => {
    assert.isDefined(slotsList, "slotsList is not defined");
    assert.isArray(slotsList, "slotsList is not an array");
  });
});

suite("susList", () => {
  test("is defined", () => {
    assert.isDefined(SusList, "susList is not defined");
    assert.isArray(SusList, "susList is not an array");
  });
});

suite("topicList", () => {
  test("is defined", () => {
    assert.isDefined(topicList, "topicList is not defined");
    assert.isString(topicList, "topicList is not a string");
  });
});

suite("translatorList", () => {
  test("is defined", () => {
    assert.isDefined(translatorList, "translatorList is not defined");
    assert.isArray(translatorList, "translatorList is not an array");
  });
});

suite("updatesData", () => {
  test("is defined", () => {
    assert.isDefined(
      updatesSinceLastRelease,
      "updatesSinceLastRelease is not defined"
    );
    assert.isArray(
      updatesSinceLastRelease,
      "updatesSinceLastRelease is not an array"
    );
    assert.isDefined(
      nextScheduledRelease,
      "nextScheduledRelease is not defined"
    );
    assert.isString(
      nextScheduledRelease,
      "nextScheduledRelease is not a string"
    );
  });
});
