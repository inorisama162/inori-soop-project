import { archiveItems, type ArchiveItem } from "./archive-data";
import { FILTER_LABELS } from "./archive-query";
import { canonicalizeTags, curateTags, inferGames, inferTags } from "./tag-utils";

export { archiveItems } from "./archive-data";
export type { ArchiveItem, StoryEntry } from "./archive-data";
export { matchesSearch, matchesFilter, countTags } from "./archive-query";
export { normalizeSearch } from "./tag-utils";
export const SOLO_START = "2025-12-19";

const reviewedById = new Map(archiveItems.map((item) => [item.id, item]));
const allowedGroups = new Set(Object.entries(FILTER_LABELS)
  .filter(([filter]) => filter !== "all" && filter !== "recommended")
  .map(([, label]) => label as string));
type IncomingItem = Pick<ArchiveItem, "id" | "title" | "date"> & Partial<Omit<ArchiveItem, "thumbnailUrl">> & { thumbnailUrl?: string | null };

// Keep the former module path compatible while using one reviewed archive.
export function normalizeItem(item: IncomingItem): ArchiveItem {
  const reviewed = reviewedById.get(item.id);
  if (reviewed) return {
    ...reviewed,
    durationSeconds: item.durationSeconds ?? reviewed.durationSeconds,
    thumbnailUrl: item.thumbnailUrl ?? reviewed.thumbnailUrl,
  };

  const title = item.broadcastTitle ?? item.title;
  const games = canonicalizeTags([...(item.games ?? []), ...inferGames(title)]);
  const groups = new Set((item.groups ?? []).map((group) => group === "기타 스토리 게임" ? "기타 서브컬쳐" : group).filter((group) => allowedGroups.has(group)));
  const searchTags = canonicalizeTags([...(item.searchTags ?? item.tags ?? []), ...games, ...inferTags(title)]);
  if (groups.has("스코프 시리즈")) groups.add("모든 자체 컨텐츠");
  return {
    ...item,
    broadcastTitle: title,
    url: item.url ?? `https://vod.sooplive.com/player/${item.id}`,
    rating: item.rating ?? 0,
    thumbnailUrl: item.thumbnailUrl ?? undefined,
    tags: curateTags(searchTags, games),
    searchTags,
    games,
    groups: item.date < SOLO_START ? [] : [...groups],
    stories: item.date < SOLO_START ? [] : item.stories ?? [],
  };
}
