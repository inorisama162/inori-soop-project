import assert from "node:assert/strict";
import test from "node:test";
import { mergeSnapshot } from "../scripts/snapshot.mjs";

const vod = (id, title = "방송") => ({ id, title, date: "2026-11-11", url: `https://vod.sooplive.com/player/${id}` });
const incoming = (items) => ({ items, updatedAt: "2026-11-11T00:17:00.000Z", partial: false });

test("adds new broadcasts and updates metadata without removing retained replays", () => {
  const previous = { items: [vod(1), vod(2)] };
  const result = mergeSnapshot(previous, incoming([vod(2, "바뀐 제목"), vod(3)]));
  assert.deepEqual(result.items.map(({ id }) => id), [3, 2, 1]);
  assert.equal(result.items.find(({ id }) => id === 2).title, "바뀐 제목");
  assert.equal(previous.items[1].title, "방송");
});

test("rejects partial, empty and unavailable responses", () => {
  for (const response of [incoming([]), { ...incoming([vod(1)]), partial: true }, { ...incoming([vod(1)]), unavailable: true }]) {
    assert.throws(() => mergeSnapshot({ items: [vod(9)] }, response));
  }
});

test("rejects malformed IDs and unrelated replay URLs", () => {
  assert.throws(() => mergeSnapshot({ items: [] }, incoming([vod(1.5)])));
  assert.throws(() => mergeSnapshot({ items: [] }, incoming([{ ...vod(1), url: "https://example.com" }])));
});
