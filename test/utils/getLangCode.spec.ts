import { assert } from "chai";

import {
  getInteractionLanguage,
  getMessageLanguage,
} from "../../src/utils/getLangCode";

suite("getLangCode", () => {
  test("is defined", () => {
    assert.isDefined(
      getInteractionLanguage,
      "getInteractionLanguage is not defined"
    );
    assert.isFunction(
      getInteractionLanguage,
      "getInteractionLanguage is not a function"
    );
    assert.isDefined(getMessageLanguage, "getMessageLanguage is not defined");
    assert.isFunction(
      getMessageLanguage,
      "getMessageLanguage is not a function"
    );
  });
});
