import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const expectedOfficialChannels = [
  "https://www.linkedin.com/company/bontoys-by-benran",
  "https://www.youtube.com/@BontoysByBenran",
  "https://x.com/Bontoysbybenran",
  "https://www.crunchbase.com/organization/bontoys-by-benran",
  "https://www.tiktok.com/@bontoysbybenran",
  "https://www.instagram.com/bontoysonline/",
];
const expectedLatestSnapshots = [
  "https://web.archive.org/web/20260714191345/https://bontoys.online/",
  "https://web.archive.org/web/20260714191404/https://bontoys.online/about",
  "https://web.archive.org/web/20260714191428/https://bontoys.online/press",
  "https://web.archive.org/web/20260714191540/https://bontoys.online/evidence/ai-voice-toy-demo",
];
const expectedVersionedRecord =
  "https://github.com/vimboom123/bontoys-by-benran-public-rd-record/releases/tag/public-rd-record-v6";
const expectedVersionedRecordSnapshot =
  "https://web.archive.org/web/20260714192613/https://github.com/vimboom123/bontoys-by-benran-public-rd-record/releases/tag/public-rd-record-v1";
const expectedVoiceModuleGuide =
  "https://bontoys.online/guides/voice-modules-for-existing-toys";
const expectedLlmsDirectory = "https://bontoys.online/llms.txt";
const expectedPublicVideos = [
  {
    name: "AI Voice Module for Toys: Three Play Worlds | Bontoys #Shorts",
    url: "https://www.youtube.com/watch?v=cysCyfdlGhY",
  },
  {
    name: "AI Voice Module for Toys: Cloud-Shaped Product Study | Bontoys #Shorts",
    url: "https://www.youtube.com/watch?v=lx5D8jpsLtE",
  },
  {
    name: "AI Voice Toy Character Concept | Bontoys by Benran #Shorts",
    url: "https://www.youtube.com/watch?v=NQT63vuvOB8",
  },
];

test("publishes the approved official channels in the README and machine-readable record", async () => {
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
  assert.match(readme, /Owner-confirmed official TikTok profile/);
  assert.match(readme, /Owner-confirmed official Instagram profile/);
  assert.match(readme, /does not assert that every platform exposes a reciprocal website backlink/i);
});

test("links the concise agent-readable facts directory", async () => {
  const [readme, recordSource] = await Promise.all([
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../public-record.json", import.meta.url), "utf8"),
  ]);
  const record = JSON.parse(recordSource);

  assert.match(
    readme,
    new RegExp(expectedLlmsDirectory.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
  );
  assert.deepEqual(record.citation, [expectedLlmsDirectory]);
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

test("publishes the three public concept videos with exact platform facts and evidence limits", async () => {
  const [readme, recordSource] = await Promise.all([
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../public-record.json", import.meta.url), "utf8"),
  ]);
  const record = JSON.parse(recordSource);

  assert.equal(record.dateModified, "2026-07-15");
  assert.equal(record.video.length, 3);
  for (const expected of expectedPublicVideos) {
    assert.match(
      readme,
      new RegExp(expected.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
    const video = record.video.find((item) => item.url === expected.url);
    assert.ok(video, `missing VideoObject for ${expected.url}`);
    assert.equal(video["@type"], "VideoObject");
    assert.equal(video.name, expected.name);
    assert.equal(video.duration, "PT16S");
    assert.equal(video.uploadDate, "2026-07-15");
    assert.equal(video.inLanguage, "en");
    assert.deepEqual(video.isPartOf, {
      "@id": "https://bontoys.online/evidence/ai-voice-toy-demo#article",
    });
    assert.match(video.description, /AI-generated R&D concept visualization/i);
    assert.match(video.description, /not footage of the physical prototype/i);
    assert.match(video.description, /not a final production unit/i);
  }
  assert.match(readme, /AI-generated R&D concept visualizations/i);
  assert.match(readme, /do not show the physical prototype or final production units/i);
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
