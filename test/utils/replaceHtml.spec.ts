import { assert } from "chai";

import { replaceHtml } from "../../src/utils/replaceHtml";

suite("replaceHtml", () => {
  test("is defined", () => {
    assert.isDefined(replaceHtml, "replaceHtml is not defined");
    assert.isFunction(replaceHtml, "replaceHtml is not a function");
  });
});
