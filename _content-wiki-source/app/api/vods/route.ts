import { siteConfig, type VodItem } from "@/lib/site-config";

export const dynamic = "force-dynamic";

type UnknownRecord = Record<string, unknown>;
type VodPage = { items: VodItem[]; rawCount: number; lastPage: number | null; total: number | null; hasNext: boolean };

const PAGE_SIZE = 60;
const MAX_PAGES = 40;
const PAGE_CONCURRENCY = 3;

function record(value: unknown): UnknownRecord {
  return value && typeof value === "object" ? (value as UnknownRecord) : {};
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function finiteNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function localDate(value: unknown): string {
  const raw = text(value);
  // SOOP's timezone-less reg_date is already Korean local time.
  if (/^\d{4}-\d{2}-\d{2}(?:$|[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?)$/.test(raw)) return raw.slice(0, 10);
  const timestamp = new Date(raw);
  if (Number.isNaN(timestamp.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(timestamp);
}

function thumbnailUrl(value: unknown): string | null {
  const raw = text(value);
  if (!raw) return null;
  try {
    const url = new URL(raw.startsWith("//") ? `https:${raw}` : raw);
    if (url.protocol !== "https:" || !url.hostname.endsWith(".sooplive.com")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function sanitizeVod(value: unknown): VodItem | null {
  const item = record(value);
  const ucc = record(item.ucc);
  const count = record(item.count);
  const id = finiteNumber(item.title_no);
  const title = text(item.title_name);
  const date = localDate(item.reg_date);
  if (id === null || !Number.isSafeInteger(id) || id < 1 || !title || !date || text(item.user_id) !== siteConfig.channelId || text(ucc.file_type) !== "REVIEW") return null;
  const duration = finiteNumber(ucc.total_file_duration);
  return {
    id, title, date,
    // SOOP reports total_file_duration in milliseconds, including short replays.
    durationSeconds: duration !== null && duration >= 0 ? Math.round(duration / 1000) : null,
    views: finiteNumber(count.read_cnt),
    url: `https://vod.sooplive.com/player/${id}`,
    category: "다시보기",
    thumbnailUrl: thumbnailUrl(ucc.thumb),
  };
}

async function fetchPage(page: number): Promise<VodPage> {
  const params = new URLSearchParams({ page: String(page), per_page: String(PAGE_SIZE), orderby: "reg_date", field: "title,contents", keyword: "" });
  const endpoint = `${siteConfig.soopApiBase}/${encodeURIComponent(siteConfig.channelId)}/vods/review?${params}`;
  const response = await fetch(endpoint, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error("SOOP replay page unavailable");
  const payload = record(await response.json());
  if (!Array.isArray(payload.data)) throw new Error("Invalid SOOP replay page");
  const meta = record(payload.meta);
  const links = record(payload.links);
  const lastPage = finiteNumber(meta.last_page);
  return {
    items: payload.data.map(sanitizeVod).filter((item): item is VodItem => item !== null),
    rawCount: payload.data.length,
    lastPage: lastPage !== null && Number.isSafeInteger(lastPage) && lastPage >= 1 ? lastPage : null,
    total: finiteNumber(meta.total),
    hasNext: typeof links.next === "string" && links.next.length > 0,
  };
}

function json(body: unknown, cacheControl: string): Response {
  return Response.json(body, { headers: { "Cache-Control": cacheControl, "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'", "X-Content-Type-Options": "nosniff" } });
}

export async function GET() {
  const byId = new Map<number, VodItem>();
  let pagesFetched = 0;
  let sourceTotal: number | null = null;
  let partial = false;
  const addPage = (page: VodPage) => {
    pagesFetched += 1;
    page.items.forEach((item) => byId.set(item.id, item));
    if (page.total !== null) sourceTotal = Math.max(sourceTotal ?? 0, page.total);
  };

  try {
    const first = await fetchPage(1);
    addPage(first);
    if (first.lastPage !== null) {
      const last = Math.min(first.lastPage, MAX_PAGES);
      partial = first.lastPage > MAX_PAGES;
      for (let start = 2; start <= last; start += PAGE_CONCURRENCY) {
        const pageNumbers = Array.from({ length: Math.min(PAGE_CONCURRENCY, last - start + 1) }, (_, index) => start + index);
        const results = await Promise.allSettled(pageNumbers.map(fetchPage));
        results.forEach((result) => {
          if (result.status === "fulfilled") addPage(result.value);
          else partial = true;
        });
      }
    } else {
      let previous = first;
      let page = 2;
      while ((previous.hasNext || previous.rawCount === PAGE_SIZE) && page <= MAX_PAGES) {
        previous = await fetchPage(page);
        addPage(previous);
        page += 1;
      }
      partial = page > MAX_PAGES && (previous.hasNext || previous.rawCount === PAGE_SIZE);
    }
  } catch {
    partial = true;
  }

  if (pagesFetched === 0) {
    return json({ items: [], updatedAt: null, source: "SOOP 공개 다시보기", unavailable: true, partial: true }, "public, max-age=60, s-maxage=300, stale-while-revalidate=86400");
  }

  if (sourceTotal !== null && byId.size < sourceTotal) partial = true;
  const items = [...byId.values()].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  return json(
    { items, updatedAt: new Date().toISOString(), source: "SOOP 공개 다시보기", partial, pagesFetched, sourceTotal },
    partial ? "public, max-age=60, s-maxage=300, stale-while-revalidate=86400" : `public, max-age=300, s-maxage=${siteConfig.cacheSeconds}, stale-while-revalidate=604800`,
  );
}
