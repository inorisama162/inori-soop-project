"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LayoutGrid, Star, ScanSearch, MessageCircle, BookOpen, Swords, Gamepad2, PersonStanding, Headphones, Users, UsersRound, UserRoundPlus, Search, RotateCcw, ArrowUp, ChevronDown, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { archiveItems, type ArchiveItem, type StoryEntry } from "@/lib/archive-data";
import { normalizeItem } from "@/lib/archive-model";
import { FILTER_LABELS, countTags, isFilterId, matchesFilter, matchesSearch, type FilterId } from "@/lib/archive-query";
import { GAME_RELATED_TAGS, curateTags, isVisibleTag, normalizeSearch, tagCloudSearchText, tagLabel } from "@/lib/tag-utils";
import type { VodItem } from "@/lib/site-config";
import { recommendedVods, recommendationSummary, summaryBasis } from "@/lib/recommendations";

type Status = "loading" | "ready" | "partial" | "fallback";
type StoryKind = StoryEntry["kind"];

const COLLECTIONS = [
  { id: "all", label: "전체", icon: LayoutGrid },
  { id: "recommended", label: "추천", icon: Star },
  { id: "scope", label: "스코프 시리즈", icon: ScanSearch },
  { id: "original", label: "자체 컨텐츠", icon: MessageCircle },
  { id: "limbus", label: "림버스컴퍼니", icon: BookOpen },
  { id: "nikke", label: "니케", icon: Swords },
  { id: "storyGames", label: "기타 서브컬쳐", icon: Gamepad2 },
  { id: "motion", label: "풀트·모캡", icon: PersonStanding },
  { id: "asmr", label: "ASMR", icon: Headphones },
  { id: "underground", label: "지하돌 합방", icon: Users },
  { id: "undergroundGame", label: "지하돌 게임", icon: UsersRound },
  { id: "external", label: "외부 합방", icon: UserRoundPlus },
] as const;

const displayFilterLabels = { ...FILTER_LABELS, limbus: "림버스컴퍼니" };

function formatDate(value: string): string {
  const date = new Date(value + "T00:00:00Z");
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(date);
}

function formatDuration(seconds?: number | null): string | null {
  if (!seconds || seconds < 1) return null;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? hours + "시간 " + minutes + "분" : minutes + "분";
}

function VodCard({ item, featured = false, onTag, selectedTags, story, summaryOpen, onSummaryToggle }: {
  item: ArchiveItem;
  featured?: boolean;
  onTag: (tag: string) => void;
  selectedTags: string[];
  story?: StoryEntry;
  summaryOpen?: boolean;
  onSummaryToggle?: (open: boolean) => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const [expandedTags, setExpandedTags] = useState(false);
  const duration = formatDuration(item.durationSeconds);
  const displayTags = item.tags.filter(isVisibleTag);
  const visibleTags = expandedTags ? displayTags : displayTags.slice(0, 3);
  return (
    <article className={"vod-card" + (featured ? " featured" : "")} data-vod-id={item.id}>
      <a className="vod-thumb" href={item.url} target="_blank" rel="noreferrer" aria-label={item.title + " 다시보기 열기"}>
        {item.thumbnailUrl && !imageFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.thumbnailUrl} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setImageFailed(true)} />
        ) : <div className="vod-thumb-fallback" aria-hidden="true"><span>I</span><small>INORI VOD</small></div>}
        {duration ? <span className="thumbnail-duration">{duration}</span> : null}
        <span className="play-mark" aria-hidden="true">▶</span>
      </a>
      <div className="vod-card-body">
        {story?.part ? <p className="story-part">{story.part}</p> : null}
        <a className="vod-title-link" href={item.url} target="_blank" rel="noreferrer"><h3>{item.title}<span aria-hidden="true"> ↗</span></h3></a>
        {item.broadcastTitle !== item.title ? <p className="broadcast-title">{item.broadcastTitle}</p> : null}
        {story?.note ? <p className="story-note">{story.note}</p> : null}
        <div className="tag-row" aria-label="이 방송의 태그">
          {visibleTags.map((tag) => <button type="button" key={tag} onClick={() => onTag(tag)} aria-pressed={selectedTags.includes(tag)}>#{tagLabel(tag)}</button>)}
          {!expandedTags && displayTags.length > 3 ? <button type="button" className="more-card-tags" onClick={() => setExpandedTags(true)} aria-label="이 방송의 태그 더 보기">+{displayTags.length - 3}</button> : null}
        </div>
        <div className="card-meta">
          <time dateTime={item.date}>{formatDate(item.date)}</time>
          {item.auto ? <span className="new-tag">새로 추가</span> : null}
          {item.sourceStatus === "retained" ? <span className="retained-label">기존 보관 링크</span> : null}
          {item.rating > 0 ? <span className="rating" aria-label={"추천점수 " + item.rating + "점"}>{"★".repeat(item.rating)}</span> : null}
        </div>
        {recommendationSummary.has(item.id) && <details className="vod-summary" open={summaryOpen} onToggle={(event) => onSummaryToggle?.(event.currentTarget.open)}><summary>AI 컨텐츠 요약</summary><p>{recommendationSummary.get(item.id)}</p><small>{summaryBasis}</small></details>}
      </div>
    </article>
  );
}

function RecommendationCarousel({ items, onTag, selectedTags }: { items: ArchiveItem[]; onTag: (tag: string) => void; selectedTags: string[] }) {
  const viewport = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  activeRef.current = active;
  const [autoPlay, setAutoPlay] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [openSummary, setOpenSummary] = useState<number | null>(null);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => { setReducedMotion(preference.matches); if (preference.matches) setAutoPlay(false); };
    const updateVisibility = () => setPageHidden(document.hidden);
    updatePreference(); updateVisibility();
    preference.addEventListener('change', updatePreference);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => { preference.removeEventListener('change', updatePreference); document.removeEventListener('visibilitychange', updateVisibility); };
  }, []);

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const observer = new ResizeObserver(() => element.scrollTo({ left: element.clientWidth * activeRef.current, behavior: 'instant' }));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function moveTo(index: number) {
    const next = (index + items.length) % items.length;
    setOpenSummary(null);
    viewport.current?.scrollTo({ left: viewport.current.clientWidth * next, behavior: reducedMotion ? 'instant' : 'smooth' });
  }

  useEffect(() => {
    if (!autoPlay || hovered || focused || pageHidden || openSummary !== null || items.length < 2) return;
    const timer = window.setTimeout(() => {
      const element = viewport.current;
      element?.scrollTo({ left: element.clientWidth * ((active + 1) % items.length), behavior: reducedMotion ? 'instant' : 'smooth' });
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [active, autoPlay, hovered, focused, pageHidden, openSummary, items.length, reducedMotion]);

  return <section className="recommended-section" aria-labelledby="recommended-title" aria-roledescription="carousel" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
    <div className="section-heading recommendation-heading"><h2 id="recommended-title">추천 다시보기</h2><div className="carousel-controls">
      <button type="button" aria-label={autoPlay ? '추천 자동 넘김 끄기' : '추천 자동 넘김 켜기'} aria-pressed={autoPlay} onClick={() => setAutoPlay(!autoPlay)}>{autoPlay ? <Pause size={14} /> : <Play size={14} />}</button>
      <span className="carousel-count" aria-live="off">{active + 1} / {items.length}</span>
      <button type="button" aria-label="이전 추천 다시보기" onClick={() => moveTo(active - 1)}><ChevronLeft size={17} /></button>
      <button type="button" aria-label="다음 추천 다시보기" onClick={() => moveTo(active + 1)}><ChevronRight size={17} /></button>
    </div></div>
    <div className="recommendation-viewport" ref={viewport} onScroll={(event) => { const element = event.currentTarget; const next = Math.round(element.scrollLeft / element.clientWidth); if (next >= 0 && next < items.length) setActive(next); }} aria-live="off">
      {items.map((item, index) => <div className="recommendation-slide" key={item.id} role="group" aria-roledescription="slide" aria-label={`${index + 1} / ${items.length}`} aria-hidden={index !== active} inert={index !== active}><VodCard item={item} featured onTag={onTag} selectedTags={selectedTags} summaryOpen={openSummary === item.id} onSummaryToggle={(open) => setOpenSummary((current) => open ? item.id : current === item.id ? null : current)} /></div>)}
    </div>
  </section>;
}

export default function ArchiveClient({ vodEndpoint = "/api/vods" }: { vodEndpoint?: string }) {
  const [liveItems, setLiveItems] = useState<VodItem[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [storyKind, setStoryKind] = useState<StoryKind>("main");
  const [tagQuery, setTagQuery] = useState("");
  const [gameTagsOnly, setGameTagsOnly] = useState(false);
  const [allTagsVisible, setAllTagsVisible] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);
  const [urlReady, setUrlReady] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const series = params.get("series") ?? "all";
    const kind = params.get("story") ?? "main";
    setActiveFilter(isFilterId(series) ? series : "all");
    setQuery((params.get("q") ?? "").slice(0, 250));
    setSelectedTags(curateTags(params.getAll("tag")).slice(0, 20));
    setResultsOpen((params.has("series") && isFilterId(series)) || Boolean(params.get("q")?.trim()) || params.getAll("tag").some((tag) => tag.trim()));
    if (["main", "event", "other", "pending"].includes(kind)) setStoryKind(kind as StoryKind);
    setUrlReady(true);
  }, []);

  useEffect(() => {
    if (!urlReady) return;
    const url = new URL(window.location.href);
    ["q", "series", "tag", "story"].forEach((key) => url.searchParams.delete(key));
    if (query.trim()) url.searchParams.set("q", query.trim());
    if (activeFilter !== "all" || (resultsOpen && !query.trim() && selectedTags.length === 0)) url.searchParams.set("series", activeFilter);
    selectedTags.forEach((tag) => url.searchParams.append("tag", tag));
    if ((activeFilter === "limbus" || activeFilter === "nikke") && storyKind !== "main") url.searchParams.set("story", storyKind);
    window.history.replaceState(window.history.state, "", url);
  }, [query, activeFilter, selectedTags, storyKind, urlReady, resultsOpen]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(vodEndpoint, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error("목록을 불러오지 못했습니다."); return response.json(); })
      .then((payload: { items?: VodItem[]; updatedAt?: string | null; unavailable?: boolean; partial?: boolean }) => {
        if (payload.unavailable || !Array.isArray(payload.items)) { setStatus("fallback"); return; }
        setLiveItems(payload.items);
        setStatus(payload.partial ? "partial" : "ready");
      })
      .catch((error: unknown) => { if ((error as { name?: string }).name !== "AbortError") setStatus("fallback"); });
    return () => controller.abort();
  }, [vodEndpoint]);

  const combined = useMemo(() => {
    const byId = new Map<number, ArchiveItem>(archiveItems.map((item) => [item.id, item]));
    liveItems.forEach((item) => {
      const existing = byId.get(item.id);
      if (existing) {
        byId.set(item.id, { ...existing, durationSeconds: item.durationSeconds ?? existing.durationSeconds, thumbnailUrl: item.thumbnailUrl ?? existing.thumbnailUrl });
      } else {
        byId.set(item.id, normalizeItem({
          id: item.id, title: item.title, broadcastTitle: item.title,
          date: item.date, url: item.url, rating: 0, auto: true,
          durationSeconds: item.durationSeconds, thumbnailUrl: item.thumbnailUrl ?? undefined,
        }));
      }
    });
    return [...byId.values()].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  }, [liveItems]);

  const recommended = useMemo(() => recommendedVods.map(({ id }) => combined.find((item) => item.id === id)).filter((item): item is ArchiveItem => Boolean(item)), [combined]);
  const tagCounts = useMemo(() => countTags(combined).filter(({ tag }) => isVisibleTag(tag)), [combined]);
  const gameTags = useMemo(() => new Set(combined.flatMap((item) => [...curateTags([], item.games), ...item.tags.filter((tag) => (GAME_RELATED_TAGS as readonly string[]).includes(tag))])), [combined]);
  const cloudTags = useMemo(() => tagCounts.filter(({ tag }) =>
    (!gameTagsOnly || gameTags.has(tag)) && (!tagQuery.trim() || normalizeSearch(tagCloudSearchText(tag)).includes(normalizeSearch(tagQuery)))
  ), [tagCounts, gameTagsOnly, gameTags, tagQuery]);
  const shownCloudTags = allTagsVisible || tagQuery.trim() ? cloudTags : cloudTags.slice(0, 20);
  const maxTagCount = tagCounts[0]?.count ?? 1;
  const storyGame = activeFilter === "limbus" || activeFilter === "nikke" ? activeFilter : null;
  const storyModes = useMemo(() => {
    if (!storyGame) return [];
    const labels: Record<StoryKind, string> = { main: "스토리", event: "이벤트", other: "기타 방송", pending: "미분류" };
    return (["main", "event", "other", "pending"] as StoryKind[]).map((kind) => ({
      kind, label: labels[kind], count: combined.filter((item) => item.stories?.some((entry) => entry.game === storyGame && entry.kind === kind)).length,
    })).filter((mode) => mode.count > 0);
  }, [combined, storyGame]);

  const filtered = useMemo(() => combined.filter((item) => {
    return matchesFilter(item, activeFilter)
      && selectedTags.every((tag) => item.tags.includes(tag))
      && matchesSearch(item, query)
      && (!storyGame || item.stories?.some((entry) => entry.game === storyGame && entry.kind === storyKind));
  }), [combined, query, activeFilter, selectedTags, storyGame, storyKind]);

  const timeline = useMemo(() => {
    if (!storyGame || !["main", "event"].includes(storyKind)) return null;
    const entries = filtered.map((item) => ({ item, story: item.stories!.find((entry) => entry.game === storyGame && entry.kind === storyKind)! }))
      .sort((a, b) => a.story.order - b.story.order || a.item.date.localeCompare(b.item.date) || a.item.id - b.item.id);
    const groups = new Map<string, { label: string; entries: typeof entries }>();
    entries.forEach((entry) => {
      if (!groups.has(entry.story.key)) groups.set(entry.story.key, { label: entry.story.label, entries: [] });
      groups.get(entry.story.key)!.entries.push(entry);
    });
    return [...groups.entries()];
  }, [filtered, storyGame, storyKind]);

  useEffect(() => { setVisibleCount(24); }, [query, activeFilter, selectedTags, storyKind]);

  function scrollToResults() {
    requestAnimationFrame(() => {
      document.getElementById("archive-title")?.focus({ preventScroll: true });
      document.getElementById("all-content")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    });
  }

  function chooseFilter(filter: FilterId) {
    setResultsOpen(true);
    setActiveFilter(filter); setQuery(""); setSelectedTags([]); setStoryKind("main"); setVisibleCount(24);
    scrollToResults();
  }

  function toggleTag(tag: string) {
    setResultsOpen(true);
    setActiveFilter("all"); setQuery(""); setVisibleCount(24);
    setSelectedTags((current) => current.includes(tag) ? current.filter((value) => value !== tag) : [...current, tag]);
    scrollToResults();
  }

  function resetSearch() {
    setResultsOpen(false);
    setActiveFilter("all"); setSelectedTags([]); setQuery(""); setStoryKind("main"); setVisibleCount(24);
  }

  const hasFilters = resultsOpen || activeFilter !== "all" || selectedTags.length > 0 || query.length > 0;

  return (
    <>
      {recommended.length > 0 ? <RecommendationCarousel items={recommended} onTag={toggleTag} selectedTags={selectedTags} /> : null}

      <section className="series-section" aria-labelledby="series-title">
        <div className="section-heading compact"><h2 id="series-title">모아보기</h2></div>
        <div className="collection-grid" aria-label="컨텐츠 분류">
          {COLLECTIONS.map(({ id, label, icon: Icon }) => <button className="collection-card" type="button" key={id} onClick={() => chooseFilter(id)} aria-label={displayFilterLabels[id]} aria-pressed={resultsOpen && activeFilter === id && selectedTags.length === 0}><Icon size={22} strokeWidth={1.6} aria-hidden="true" /><span>{label}</span></button>)}
        </div>
      </section>

      <section id="tag-cloud" className="tag-cloud-section" aria-labelledby="tag-cloud-title">
        <div className="section-heading compact"><h2 id="tag-cloud-title">태그</h2></div>
        <div className="tag-cloud-tools">
          <div className="segmented-control" aria-label="태그 종류"><button type="button" onClick={() => setGameTagsOnly(false)} aria-pressed={!gameTagsOnly}>전체</button><button type="button" onClick={() => setGameTagsOnly(true)} aria-pressed={gameTagsOnly}>게임</button></div>
          <label className="tag-search"><Search size={15} aria-hidden="true" /><span className="sr-only">태그 찾기</span><input value={tagQuery} onChange={(event) => setTagQuery(event.target.value)} placeholder="태그 찾기" type="search" /></label>
        </div>
        <div className="tag-cloud" aria-label="다시보기 태그 구름">
          {shownCloudTags.map(({ tag, count }) => <button type="button" key={tag} className={"cloud-tag" + (gameTags.has(tag) ? " game-tag" : "")} data-weight={Math.min(5, 1 + Math.floor(Math.sqrt(count / maxTagCount) * 4))} aria-pressed={selectedTags.includes(tag)} onClick={() => toggleTag(tag)} aria-label={"#" + tagLabel(tag) + " 태그, " + count + "개 다시보기"}><span>#{tagLabel(tag)}</span><small>{count}</small></button>)}
          {shownCloudTags.length === 0 ? <p className="tag-empty">해당하는 태그가 없습니다.</p> : null}
        </div>
        {!tagQuery.trim() && cloudTags.length > 20 ? <button className="expand-tags" type="button" onClick={() => setAllTagsVisible(!allTagsVisible)} aria-expanded={allTagsVisible}>{allTagsVisible ? "접기" : "더 보기"}<ChevronDown size={14} aria-hidden="true" /></button> : null}
      </section>

      <section id="all-content" className="archive-section" aria-labelledby="archive-title">
        <div className="section-heading archive-heading"><h2 id="archive-title" tabIndex={-1}>{!resultsOpen ? "검색" : selectedTags.length ? "태그 검색" : activeFilter === "original" ? "자체 컨텐츠" : displayFilterLabels[activeFilter]}</h2>{resultsOpen && <a className="back-to-collections" href="#series-title"><ArrowUp size={14} aria-hidden="true" />모아보기</a>}<span className="sr-only" role="status">{status === "loading" ? "목록 확인 중" : status === "ready" ? "최신 목록 확인 완료" : "저장된 목록 표시 중"}</span></div>
        <div className="archive-tools">
          <label className="search-box"><Search size={18} aria-hidden="true" /><span className="sr-only">다시보기 검색</span><input value={query} onChange={(event) => { setQuery(event.target.value); setResultsOpen(Boolean(event.target.value.trim()) || activeFilter !== "all" || selectedTags.length > 0); }} type="search" placeholder="제목 · 게임 · 태그" /></label>
          <button className="reset-filter" type="button" onClick={resetSearch} disabled={!hasFilters} aria-label="검색 및 분류 초기화"><RotateCcw size={15} aria-hidden="true" />초기화</button>
        </div>
        {resultsOpen && <>
        <div className="active-filters" aria-label="선택한 검색 조건">
          {selectedTags.map((tag) => <button key={tag} type="button" onClick={() => setSelectedTags(selectedTags.filter((value) => value !== tag))} aria-label={"#" + tagLabel(tag) + " 태그 해제"}>#{tagLabel(tag)}<span aria-hidden="true">×</span></button>)}
          {selectedTags.length > 1 ? <span className="filter-hint">선택한 태그 모두 포함</span> : null}
        </div>
        {storyGame ? <>
          <div className="story-tabs" aria-label="스토리 분류">{storyModes.map((mode) => <button key={mode.kind} type="button" aria-pressed={storyKind === mode.kind} onClick={() => setStoryKind(mode.kind)}>{mode.label}<span>{mode.count}</span></button>)}</div>
        </> : null}
        <div className="result-summary" role="status" aria-live="polite" aria-atomic="true"><span><strong>{filtered.length}</strong>개의 다시보기</span><span>{timeline ? "스토리순" : "최신순"}</span></div>
        {filtered.length > 0 ? timeline ? <div className="story-timeline">{timeline.map(([key, group], index) => <section className="timeline-step" key={key} aria-labelledby={"chapter-" + key}><div className="chapter-heading"><span className="chapter-dot" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><h3 id={"chapter-" + key}>{group.label}</h3><span>{group.entries.length}개 다시보기</span></div></div><div className="chapter-grid">{group.entries.map(({ item, story }) => <VodCard key={item.id} item={item} story={story} onTag={toggleTag} selectedTags={selectedTags} />)}</div></section>)}</div> : <>
          <div className="archive-grid">{filtered.slice(0, visibleCount).map((item) => <VodCard key={item.id} item={item} onTag={toggleTag} selectedTags={selectedTags} />)}</div>
          {filtered.length > visibleCount ? <button type="button" className="load-more" onClick={() => setVisibleCount((current) => current + 24)}>다시보기 더 보기 <span>{Math.min(visibleCount, filtered.length)} / {filtered.length}</span><span aria-hidden="true">↓</span></button> : null}
        </> : <div className="empty-state"><strong>조건에 맞는 다시보기가 없습니다.</strong><span>검색어나 선택한 태그를 바꿔보세요.</span><button className="reset-filter" type="button" onClick={() => chooseFilter("all")}>모든 다시보기 보기</button></div>}
        </>}
      </section>
    </>
  );
}
