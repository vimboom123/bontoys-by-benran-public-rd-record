import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const expectedOfficialChannels = [
  "https://www.linkedin.com/company/bontoys-by-benran",
  "https://www.youtube.com/@BontoysByBenran",
  "https://x.com/Bontoysbybenran",
];
const expectedLatestSnapshots = [
  "https://web.archive.org/web/20260714191345/https://bontoys.online/",
  "https://web.archive.org/web/20260714191404/https://bontoys.online/about",
  "https://web.archive.org/web/20260714191428/https://bontoys.online/press",
  "https://web.archive.org/web/20260714191540/https://bontoys.online/evidence/ai-voice-toy-demo",
];
const expectedVersionedRecord =
  "https://github.com/vimboom123/bontoys-by-benran-public-rd-record/releases/tag/public-rd-record-v4";
const expectedVersionedRecordSnapshot =
  "https://web.archive.org/web/20260714192613/https://github.com/vimboom123/bontoys-by-benran-public-rd-record/releases/tag/public-rd-record-v1";
const expectedVoiceModuleGuide =
  "https://bontoys.online/guides/voice-modules-for-existing-toys";

test("publishes the verified official channels in the README and machine-readable record", async () => {
  const [readme, recordSource] = await Promise.all([
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../public-record.json", import.meta.url), "utf8"),
  ]);
  const record = JSON.parse(recordSource);

  for (const channelUrl of expectedOfficialChannels) {
    assert.match(readme, new RegExp(channelUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.equal(record.sameAs, undefined);
  assert.equal(record.about["@id"], "https://bontoys.online/#brand");
  assert.deepEqual(record.about.sameAs, expectedOfficialChannels);
});

test("separates Bontoys by Benran from legacy and similarly named toy brands", async () => {
  const [readme, recordSource] = await Promise.all([
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../public-record.json", import.meta.url), "utf8"),
  ]);
  const record = JSON.parse(recordSource);

  assert.match(readme, /not affiliated with the historic Italian Bontoys\/Bontempi businesses/i);
  assert.match(readme, /Bon Ton Toys/);
  assert.match(readme, /B\. toys/);
  assert.match(record.about.disambiguatingDescription, /Bontoys\/Bontempi/);
  assert.match(record.about.disambiguatingDescription, /Bon Ton Toys/);
  assert.match(record.about.disambiguatingDescription, /B\. toys/);
});

test("links the latest independent snapshots of all canonical public identity pages", async () => {
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

  for (const snapshotUrl of expectedLatestSnapshots) {
    assert.match(
      readme,
      new RegExp(snapshotUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }
});

test("links the versioned public record and its independent snapshot", async () => {
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

  for (const url of [expectedVersionedRecord, expectedVersionedRecordSnapshot]) {
    assert.match(
      readme,
      new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }
});

test("links the official voice-module guide with the current verified channel set", async () => {
  const [readme, recordSource] = await Promise.all([
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../public-record.json", import.meta.url), "utf8"),
  ]);
  const record = JSON.parse(recordSource);

  assert.match(
    readme,
    new RegExp(
      expectedVoiceModuleGuide.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    ),
  );
  assert.ok(record.isBasedOn.includes(expectedVoiceModuleGuide));
  assert.deepEqual(record.about.sameAs, expectedOfficialChannels);
});

test("publishes the exact Chinese company name and rejects the incorrect rendering", async () => {
  const [readme, recordSource] = await Promise.all([
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../public-record.json", import.meta.url), "utf8"),
  ]);
  const record = JSON.parse(recordSource);

  assert.match(
    readme,
    /The exact Chinese name is \*\*本然智趣\*\*; its English rendering is \*\*Benran Zhiqu\*\*\./,
  );
  assert.equal(record.publisher.name, "Benran Zhiqu");
  assert.equal(record.publisher.alternateName, "本然智趣");
  assert.doesNotMatch(readme + recordSource, /笨然智趣/);
});
