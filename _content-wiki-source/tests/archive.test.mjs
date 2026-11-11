import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test, { after } from 'node:test';
import { createServer } from 'vite';

const vite = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true }, server: { middlewareMode: true, hmr: false, watch: null } });
after(() => vite.close());
const canonical = await vite.ssrLoadModule('/lib/archive-data.ts');
const model = await vite.ssrLoadModule('/lib/archive-model.ts');
const { matchesFilter, matchesSearch, countTags } = await vite.ssrLoadModule('/lib/archive-query.ts');
const { canonicalizeTags, curateTags, inferTags, isVisibleTag, tagCloudSearchText } = await vite.ssrLoadModule('/lib/tag-utils.ts');
const { recommendedVods, recommendationSummary } = await vite.ssrLoadModule('/lib/recommendations.ts');
const { archiveItems, normalizeItem } = model;
const initialReview = JSON.parse(readFileSync(new URL('../lib/reviewed-archive.json', import.meta.url), 'utf8'));
const byId = new Map(archiveItems.map(item => [item.id, item]));
const retainedId = 194778647;

function storyItems(game, kind) {
  return archiveItems
    .flatMap(item => (item.stories ?? []).filter(story => story.game === game && story.kind === kind).map(story => ({ item, story })))
    .sort((a, b) => a.story.order - b.story.order || a.item.date.localeCompare(b.item.date) || a.item.id - b.item.id);
}

test('legacy module exports the canonical 235 unique replay links', () => {
  assert.strictEqual(archiveItems, canonical.archiveItems);
  assert.equal(archiveItems.length, 235);
  assert.equal(new Set(archiveItems.map(item => item.id)).size, 235);
  assert.equal(new Set(archiveItems.map(item => item.url)).size, 235);
  assert.equal(archiveItems.filter(item => item.rating === 5).length, 5);
  assert.ok(archiveItems.every(item => item.thumbnailUrl));
  assert.equal(byId.get(retainedId).sourceStatus, 'retained');
});

test('preserves the original 216 reviewed replays and adds all four newer broadcasts', () => {
  const approvedIds = initialReview.filter(item => item.date >= '2025-12-19' && item.id !== retainedId).map(item => item.id);
  assert.equal(new Set(approvedIds).size, 216);
  for (const id of approvedIds) assert.ok(byId.has(id), `Missing reviewed replay ${id}`);
  for (const id of [212268859, 212075999, 211983049, 211931977]) assert.ok(byId.has(id), `Missing new replay ${id}`);
});

test('Limbus story order includes the new continuation and preserves mixed broadcasts', () => {
  const main = storyItems('limbus', 'main');
  assert.equal(main.length, 15);
  assert.equal(main[0].item.id, 192587891);
  assert.equal(main.at(-1).item.id, 211931977);
  assert.deepEqual(main.filter(({ story }) => story.key === 'chapter-5').map(({ item }) => item.id), [201768945, 201833353, 203600087]);
  assert.deepEqual(main.filter(({ story }) => story.key === 'chapter-6.5-warp').map(({ item }) => item.id), [211908909, 211931977]);
  assert.ok(main.some(({ item }) => item.id === 200464797));
  assert.ok(main.some(({ item }) => item.id === 205153205));
  assert.deepEqual(storyItems('limbus', 'other').map(({ item }) => item.id), [200975617]);
});

test('Nikke separates main, event, other and unconfirmed broadcasts without losing any', () => {
  assert.equal(storyItems('nikke', 'main').length, 11);
  assert.equal(storyItems('nikke', 'event').length, 4);
  assert.equal(storyItems('nikke', 'other').length, 4);
  assert.equal(storyItems('nikke', 'pending').length, 1);
  for (const id of [193108915, 193178639, 193300061]) {
    assert.ok(byId.get(id).stories.some(story => story.game === 'nikke' && story.kind === 'main'));
  }
  assert.ok(byId.get(212075999).stories.some(story => story.game === 'nikke' && story.kind === 'event' && story.key === 'old-tales'));
  for (const item of archiveItems.filter(item => matchesFilter(item, 'limbus') || matchesFilter(item, 'nikke'))) {
    assert.ok(item.stories?.length, `Replay ${item.id} has no visible story tab`);
  }
});

test('all 14 pre-solo replays keep searchable tags but no series or story classification', () => {
  const older = archiveItems.filter(item => item.date < '2025-12-19');
  assert.equal(older.length, 14);
  assert.ok(older.every(item => item.groups.length === 0 && (item.stories ?? []).length === 0));
  const tagged = older.filter(item => item.tags.length > 0);
  assert.ok(tagged.length > 0);
  for (const item of tagged) assert.ok(matchesSearch(item, '#' + item.tags[0]));
  const normalized = normalizeItem({ id: 1, date: '2025-01-01', title: '배그 합방', groups: ['외부 합방'] });
  assert.deepEqual(normalized.groups, []);
  assert.deepEqual(normalized.stories, []);
  assert.ok(normalized.tags.includes('종합게임'));
  assert.ok(matchesSearch(normalized, '배그'));
});

test('all five scopes are included in the 32 own-content replays and removed menus stay absent', () => {
  const scopes = archiveItems.filter(item => matchesFilter(item, 'scope'));
  const originals = archiveItems.filter(item => matchesFilter(item, 'original'));
  assert.equal(scopes.length, 5);
  assert.equal(originals.length, 32);
  assert.ok(scopes.every(item => matchesFilter(item, 'original')));
  assert.ok(matchesFilter(byId.get(187962333), 'original'));
  assert.ok(matchesFilter(byId.get(207638473), 'storyGames'));
  const removed = new Set(['일반 게임', '같이보기', '애니 같이보기', '음악', '특집 이벤트', '토크컨텐츠', '존댓말 라디오']);
  assert.ok(archiveItems.every(item => item.groups.every(group => !removed.has(group))));
});

test('game aliases, hashtags, whitespace and combined searches return the same reviewed replays', () => {
  const ids = query => archiveItems.filter(item => matchesSearch(item, query)).map(item => item.id);
  assert.deepEqual(ids('림버스'), ids('#림버스컴퍼니'));
  assert.deepEqual(ids('림버스 컴퍼니'), ids('Limbus Company'));
  assert.deepEqual(ids('배그'), ids('배틀그라운드'));
  assert.deepEqual(ids('크아'), ids('크레이지 아케이드'));
  assert.deepEqual(ids('블아'), ids('블루 아카이브'));
  assert.deepEqual(ids('워특살'), [211931977, 211908909]);
  assert.deepEqual(ids('#림버스 #ASMR'), [205153205]);
  assert.deepEqual(ids('로보토미 2일차'), [200464797]);
  assert.ok(!matchesSearch(byId.get(200464797), '니케'));
});

test('game tags are compact while named subculture games and formats remain discoverable', () => {
  assert.ok(archiveItems.every(item => curateTags([], item.games).every(game => item.tags.includes(game))));
  assert.ok(archiveItems.every(item => new Set(item.tags).size === item.tags.length));
  for (const tag of ['림버스 컴퍼니', '로보토미 코퍼레이션']) assert.ok(byId.get(200464797).tags.includes(tag));
  for (const tag of ['림버스 컴퍼니', 'ASMR']) assert.ok(byId.get(205153205).tags.includes(tag));
  for (const tag of ['니케', '종합게임']) assert.ok(byId.get(212075999).tags.includes(tag));
  assert.ok(matchesSearch(byId.get(212075999), '에이징커브'));
  assert.ok(!matchesSearch(byId.get(212075999), '배그'));
  const counts = new Map(countTags(archiveItems).map(({ tag, count }) => [tag, count]));
  assert.equal(counts.get('림버스 컴퍼니'), 16);
  assert.equal(counts.get('니케'), 21);
  assert.ok(byId.get(201308983).tags.includes('니케'));
  assert.deepEqual(byId.get(201308983).groups, []);
  assert.equal(counts.get('스코프'), 5);
  assert.deepEqual(canonicalizeTags(['#배그', '배틀그라운드', 'PUBG']), ['배틀그라운드']);
});

test('merged tags preserve their replay union without duplicate or obsolete labels', () => {
  const counts = new Map(countTags(archiveItems).map(({ tag, count }) => [tag, count]));
  assert.equal(counts.get('마크서버'), 18);
  for (const tag of ['메인스토리', '이벤트스토리', '그냥서버', '더켓몬2', '폭주서버', '게임', '배틀그라운드', '3DIO']) assert.ok(!counts.has(tag), tag);
  for (const item of archiveItems) {
    if (item.searchTags.some(tag => ['스토리', '메인스토리', '이벤트스토리'].includes(tag))) assert.ok(item.tags.includes('스토리'));
  }
  assert.deepEqual(curateTags(['스토리', '메인 스토리', '이벤트스토리']), ['스토리']);
  assert.deepEqual(curateTags(['게임', '그냥서버', '더켓몬2', '폭주서버', '마인크래프트']), ['마크서버']);
  assert.match(tagCloudSearchText('마크서버'), /더켓몬/);
  assert.match(tagCloudSearchText('종합게임'), /배그/);
  const fresh = normalizeItem({ id: 1, date: '2026-11-11', title: '폭주서버 + 배그 합방' });
  assert.deepEqual(new Set(fresh.tags), new Set(['마크서버', '종합게임', '합방']));
  assert.ok(matchesSearch(fresh, '배틀그라운드'));
  const subculture = archiveItems.filter(item => matchesFilter(item, 'storyGames'));
  assert.equal(subculture.length, 13);
  assert.ok(subculture.every(item => item.groups.includes('기타 서브컬쳐')));
  assert.ok(archiveItems.every(item => !item.groups.includes('기타 스토리 게임')));
});

test('renamed and hidden tags stay searchable without crowding visible tags', () => {
  const visible = new Set(countTags(archiveItems).filter(({ tag }) => isVisibleTag(tag)).map(({ tag }) => tag));
  for (const tag of ['모바일 방송', '카페', '마크서버', '존댓말라디오', '사이버펑크', 'ASMR']) assert.ok(visible.has(tag), tag);
  for (const tag of ['모뱅', '카페탐방', '마인크래프트 서버', '룰렛', '테스트', '독서', '얀데레', '워프특급 살인사건', '최애캐', '퀴즈', '회고', 'Q&A', 'VR', '메이저', '빼빼로데이', '죠죠의 기묘한 모험', '오버필드', '초 카구야 공주', '케이팝', '코스프레', '타로', '홈화면', 'LAST KINGDOM', 'RED ASH', 'NEW YEAR, NEW SWORD', 'OLD TALES', 'SCP']) assert.ok(!visible.has(tag), tag);
  for (const query of ['룰렛', '테스트', '독서', '얀데레', '워특살', '최애캐', '퀴즈', '회고', 'Q&A', 'VR', '메이저', '빼빼로데이', '죠죠', '오버필드', '초 카구야 공주', '케이팝', '코스프레', '타로', '홈화면', 'LAST KINGDOM', 'SCP']) assert.ok(archiveItems.some(item => matchesSearch(item, query)), query);
  assert.equal(archiveItems.filter(item => item.tags.includes('존댓말라디오')).length, 2);
  assert.equal(archiveItems.filter(item => item.tags.includes('사이버펑크')).length, 2);
  assert.ok(!archiveItems.some(item => item.tags.includes('사펑2') || item.tags.includes('사이버펑크 엣지러너')));
  assert.deepEqual(curateTags(['모뱅', '카페탐방', '마인크래프트 서버']), ['모바일 방송', '카페', '마크서버']);
});

test('only the five selected replays are recommended and retain short summary text', () => {
  const ids = [210079829, 211177973, 209922717, 205315713, 200659991];
  assert.deepEqual(recommendedVods.map(item => item.id), ids);
  assert.deepEqual(new Set(archiveItems.filter(item => matchesFilter(item, 'recommended')).map(item => item.id)), new Set(ids));
  for (const id of ids) assert.ok(recommendationSummary.get(id).length > 20 && recommendationSummary.get(id).length < 140);
  assert.ok(byId.has(197312017) && !matchesFilter(byId.get(197312017), 'recommended'));
});

test('compatibility normalization uses shared tags and does not overwrite reviewed classifications', () => {
  assert.deepEqual(normalizeItem(initialReview.find(item => item.id === 210079829)), byId.get(210079829));
  const fresh = normalizeItem({ id: 1, date: '2026-11-11', title: '명조 스토리 + 니케 가챠' });
  assert.ok(fresh.tags.includes('명조') && fresh.tags.includes('니케') && fresh.tags.includes('가챠'));
  assert.deepEqual(fresh.groups, []);
  assert.deepEqual(fresh.stories, []);
  assert.ok(!inferTags('소통 그리고 의식의 흐름 방송').includes('그림'));
  assert.ok(!byId.get(186051183).tags.includes('그림'));
  assert.ok(!byId.get(183590419).tags.includes('그림'));
});
