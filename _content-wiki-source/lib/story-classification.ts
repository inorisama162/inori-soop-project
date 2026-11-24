import type { StoryEntry } from "./archive-data";
import { inferGames } from "./tag-utils";

const gameNames = { limbus: "림버스 컴퍼니", nikke: "니케" } as const;
const gamePatterns = { limbus: /림버스|limbus\s*company/i, nikke: /니케|nikke/i };
const nikkeEvents = [
  { pattern: /new\s*year[\s,]*new\s*sword|뉴\s*이어\s*뉴\s*소드|24\s*신년/i, key: "new-year-new-sword", label: "NEW YEAR, NEW SWORD", order: 10 },
  { pattern: /red\s*ash|레드\s*애쉬|레드\s*애시/i, key: "red-ash", label: "RED ASH", order: 20 },
  { pattern: /last\s*kingdom|라스트\s*킹덤/i, key: "last-kingdom", label: "LAST KINGDOM", order: 30 },
  { pattern: /old\s*tales|올드\s*테일즈/i, key: "old-tales", label: "OLD TALES", order: 40 },
];

function gameContext(title: string, game: keyof typeof gameNames): string {
  const parts = title.split(/\s*(?:\+|\||;)\s*/);
  const selected: string[] = [];
  let active = false;
  for (const part of parts) {
    const games = inferGames(part);
    if (gamePatterns[game].test(part)) active = true;
    else if (games.length) active = false;
    if (active) selected.push(part);
  }
  return selected.join(" + ");
}

function chapterRange(context: string, game: StoryEntry["game"]): [number, number] | null {
  const suffix = game === "limbus" ? "장" : "(?:장|지|지역|챕터)";
  const match = context.match(new RegExp(`(?<![\\d.])(\\d+(?:\\.5)?)\\s*(?:[~～–—-]\\s*(\\d+(?:\\.5)?)\\s*)?${suffix}`))
    ?? context.match(/(?:chapter|챕터)\s*(\d+)\s*(?:[~～–—-]\s*(\d+))?/i);
  if (!match) return null;
  const start = Number(match[1]);
  const end = Number(match[2] ?? match[1]);
  if (start < 0 || end < start || end > 200 || (game === "nikke" && (!Number.isInteger(start) || !Number.isInteger(end)))) return null;
  return [start, end];
}

function limbusOrder(chapter: number): number {
  if (chapter <= 2) return chapter * 5;
  return chapter < 7 ? 20 + (chapter - 3) * 20 : 110 + (chapter - 7) * 20;
}

export function inferStories(title: string): StoryEntry[] {
  return (Object.keys(gameNames) as StoryEntry["game"][]).flatMap((game) => {
    const context = gameContext(title, game);
    if (!context) return [];
    const part = context.match(/[상중하](?:\s*[~～–—-]\s*[상중하])?\s*편(?:까지)?|\d+\s*부(?:까지)?|\d+\s*일차|마무리|마지막|앞부분|이어서/)?.[0];
    const entry = (story: Omit<StoryEntry, "game" | "part">): StoryEntry[] => [{ game, ...story, ...(part ? { part } : {}) }];
    const promotion = /\bPV\b|예고편|트레일러|공식\s*방송|공방|같이보기/i;
    const hasPlayedChapter = context.split(" + ").some((section) => chapterRange(section, game) && !promotion.test(section));
    const promoOnly = promotion.test(context) && !hasPlayedChapter
      && !/스토리|메인스|읽|플레이|진행/.test(context);

    if (!promoOnly && game === "nikke") {
      const event = nikkeEvents.find(({ pattern }) => pattern.test(context));
      if (event) return entry({ kind: "event", key: event.key, label: event.label, order: event.order });
    }
    if (!promoOnly && game === "limbus") {
      if (/워특살|워프\s*특급\s*살인\s*사건/.test(context)) return entry({ kind: "main", key: "chapter-6.5-warp", label: "6.5장 2편 · 워프특급 살인사건", order: 100 });
      if (/시간\s*살인\s*시간/.test(context)) return entry({ kind: "main", key: "chapter-6.5-time", label: "6.5장 1편 · 시간살인시간", order: 90 });
    }

    const range = chapterRange(context, game);
    if (range && !promoOnly) {
      const [start, end] = range;
      if (game === "limbus" && start === 6.5 && end === 6.5) {
        return entry({ kind: "pending", key: "chapter-6.5-unconfirmed", label: "6.5장 · 편 확인 필요", order: 95 });
      }
      const span = start === end ? `${start}` : `${start}~${end}`;
      return entry({
        kind: "main", key: `chapter-${start}${start === end ? "" : `-${end}`}`,
        label: game === "limbus" ? `${span}장` : `CHAPTER ${span}`,
        order: game === "limbus" ? limbusOrder(start) : (start + end) * 5,
      });
    }
    if (!promoOnly && !/이벤트/.test(context) && /메인\s*(?:스토리|스)|스토리\s*(?:밀기|읽|진행)|스토리를?\s*봐야|스토리.*노방종/.test(context)) {
      return entry({ kind: "main", key: "main-unnumbered", label: "메인 스토리 · 챕터 미표기", order: 10000 });
    }
    if (promoOnly || /가챠|뽑기|픽업|발푸밤|발푸르기스|업데이트|미연시|니케놀이/.test(context)) {
      return entry({ kind: "other", key: "other-broadcast", label: "기타 방송", order: 0 });
    }
    return entry({ kind: "pending", key: "unconfirmed", label: "진행 내용 확인 필요", order: 0 });
  });
}

export function storyGroups(stories: StoryEntry[]): string[] {
  return [...new Set(stories.map(({ game }) => gameNames[game]))];
}
