import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const expectedOfficialChannels = [
  "https://www.linkedin.com/company/bontoys-by-benran",
  "https://www.youtube.com/@BontoysByBenran",
];

test("publishes the verified official channels in the README and machine-readable record", async () => {
  const [readme, recordSource] = await Promise.all([
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../public-record.json", import.meta.url), "utf8"),
  ]);
  const record = JSON.parse(recordSource);

  for (const channelUrl of expectedOfficialChannels) {
    assert.match(readme, new RegExp(channelUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.deepEqual(record.sameAs, expectedOfficialChannels);
});
