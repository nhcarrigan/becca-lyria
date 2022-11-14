import { assert } from "chai";
import { PhishScanner } from "phish-scanner";

suite("Phish Scanner", () => {
  test("It should return false on valid domains", async () => {
    const result = await PhishScanner("naomi.lgbt");
    assert.isFalse(result);
  });

  test("It should return true on known scam domains", async () => {
    const result = await PhishScanner("discords-gift-month.xyz");
    assert.isTrue(result);
  });
});
