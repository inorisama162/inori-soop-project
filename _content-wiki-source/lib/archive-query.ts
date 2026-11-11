import type { ArchiveItem } from "./archive-data";
import { normalizeSearch, tagSearchText } from "./tag-utils";
import { recommendedIds } from "./recommendations";

export const FILTER_LABELS = {
  all: "모든 다시보기",
  recommended: "추천 컨텐츠",
  scope: "스코프 시리즈",
  original: "모든 자체 컨텐츠",
  limbus: "림버스 컴퍼니",
  nikke: "니케",
  storyGames: "기타 서브컬쳐",
  motion: "풀트·모캡·VR",
  asmr: "ASMR",
  underground: "지하돌 합방",
  undergroundGame: "지하돌 게임 합방",
  external: "외부 합방",
} as const;

export type FilterId = keyof typeof FILTER_LABELS;

const groupForFilter: Partial<Record<FilterId, string>> = {
  scope: "스코프 시리즈",
  original: "모든 자체 컨텐츠",
  limbus: "림버스 컴퍼니",
  nikke: "니케",
  storyGames: "기타 서브컬쳐",
  motion: "풀트·모캡·VR",
  asmr: "ASMR",
  underground: "지하돌 합방",
  undergroundGame: "지하돌 게임 합방",
  external: "외부 합방",
};

export function isFilterId(value: string): value is FilterId {
  return Object.prototype.hasOwnProperty.call(FILTER_LABELS, value);
}

export function matchesFilter(item: ArchiveItem, filter: FilterId): boolean {
  if (filter === "all") return true;
  if (filter === "recommended") return recommendedIds.has(item.id);
  return item.groups.includes(groupForFilter[filter] ?? "");
}

export function matchesSearch(item: ArchiveItem, query: string): boolean {
  const terms = query.trim().split(/\s+/).map(normalizeSearch).filter(Boolean);
  if (!terms.length) return true;
  const haystack = normalizeSearch([
    item.title,
    item.broadcastTitle,
    item.date,
    ...item.groups,
    ...item.tags.map(tagSearchText),
    ...(item.searchTags ?? []).map(tagSearchText),
    ...(item.games ?? []).map(tagSearchText),
    ...(item.stories ?? []).flatMap((story) => [story.label, story.part ?? "", story.note ?? ""]),
  ].join(" "));
  return terms.every((term) => haystack.includes(term));
}

export function countTags(items: ArchiveItem[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  items.forEach((item) => new Set(item.tags).forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)));
  return [...counts].map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "ko"));
}
