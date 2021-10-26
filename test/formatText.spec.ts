import { expect } from "chai";

import { formatTextToTable } from "../src/utils/formatText";

suite("formatTextToTable", () => {
  suite("is defined", () => {
    expect(formatTextToTable).to.be.not.undefined;
    expect(typeof formatTextToTable).to.eq("function");
  });
  suite("given empty array returns empty string", () =>
    expect(formatTextToTable([])).to.eq("")
  );
  suite("given 2d empty array, returns empty string", () =>
    expect(formatTextToTable([[]])).to.eq("")
  );
  suite(
    "given 2d empty array, with seperate defined headers, returns headers",
    () =>
      expect(
        formatTextToTable([], {
          headers: ["one", "two"],
        })
      ).to.eq("one | two\n" + "---------")
  );
  // TODO: add tests to check for custom column delimiters
  suite(
    "given 2d empty array, with empty seperate defined headers, returns empty string",
    () =>
      expect(
        formatTextToTable([[]], {
          headers: [],
        })
      ).to.eq("")
  );
  suite("given 2d array with data with long headers, display table", () =>
    expect(
      formatTextToTable(
        [
          ["brad", "100"],
          ["foo", "bar"],
        ],
        {
          headers: ["name", "aggeeeeeeeee"],
        }
      )
    ).to.eq(
      "name | aggeeeeeeeee\n" +
        "-------------------\n" +
        "brad | 100         \n" +
        "foo  | bar         "
    )
  );
});
