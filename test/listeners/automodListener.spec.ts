import { assert } from "chai";

import { automodLinks } from "../../src/listeners/automod/automodLinks";
import { automodPhish } from "../../src/listeners/automod/automodPhish";
import { automodProfanity } from "../../src/listeners/automod/automodProfanity";
import { automodListener } from "../../src/listeners/automodListener";

suite("automodListener", () => {
  test("is defined", () => {
    assert.isDefined(automodListener, "automodListener is not defined");
    assert.isDefined(
      automodListener.name,
      "automodListener.name is not defined"
    );
    assert.isString(
      automodListener.name,
      "automodListener.name is not a string"
    );
    assert.isDefined(
      automodListener.description,
      "automodListener.description is not defined"
    );
    assert.isString(
      automodListener.description,
      "automodListener.description is not a string"
    );
    assert.isDefined(automodListener.run, "automodListener.run is not defined");
    assert.isFunction(
      automodListener.run,
      "automodListener.run is not a function"
    );
  });
});

suite("automodLinks", () => {
  test("is defined", () => {
    assert.isDefined(automodLinks, "automodLinks is not defined");
    assert.isFunction(automodLinks, "automodLinks is not a function");
  });
});

suite("automodPhish", () => {
  test("is defined", () => {
    assert.isDefined(automodPhish, "automodPhish is not defined");
    assert.isFunction(automodPhish, "automodPhish is not a function");
  });
});

suite("automodProfanity", () => {
  test("is defined", () => {
    assert.isDefined(automodProfanity, "automodProfanity is not defined");
    assert.isFunction(automodProfanity, "automodProfanity is not a function");
  });
});
