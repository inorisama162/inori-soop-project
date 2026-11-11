type GameRule = { tag: string; aliases: string[]; match: RegExp };

export const GAME_RELATED_TAGS = ["종합게임", "마크서버"] as const;

const gameRules: GameRule[] = [
  { tag: "림버스 컴퍼니", aliases: ["림버스","림버스컴퍼니","Limbus Company"], match: new RegExp("림버스|limbus\\s*company", "i") },
  { tag: "니케", aliases: ["승리의 여신: 니케","승리의 여신 니케","NIKKE"], match: new RegExp("니케|nikke", "i") },
  { tag: "로보토미 코퍼레이션", aliases: ["로보토미","로보토미코퍼레이션","Lobotomy Corporation"], match: new RegExp("로보토미", "i") },
  { tag: "이환", aliases: [], match: new RegExp("이환", "i") },
  { tag: "명조", aliases: ["명조: 워더링 웨이브","Wuthering Waves"], match: new RegExp("명조", "i") },
  { tag: "명일방주: 엔드필드", aliases: ["엔드필드","명일방주 엔드필드","Arknights Endfield"], match: new RegExp("엔드필드", "i") },
  { tag: "트릭컬 리바이브", aliases: ["트릭컬"], match: new RegExp("트릭컬", "i") },
  { tag: "오버필드", aliases: [], match: new RegExp("오버필드", "i") },
  { tag: "블루 아카이브", aliases: ["블루아카이브","블아","Blue Archive"], match: new RegExp("블루\\s*아카이브|blue\\s*archive", "i") },
  { tag: "MiSide", aliases: ["미사이드"], match: new RegExp("미사이드|miside", "i") },
  { tag: "and Roger", aliases: ["앤드 로저"], match: new RegExp("and\\s+roger", "i") },
  { tag: "고독방송", aliases: [], match: new RegExp("고독방송", "i") },
  { tag: "메이플스토리", aliases: ["메이플","MapleStory"], match: new RegExp("메이플|maple\\s*story", "i") },
  { tag: "방탈출 시뮬레이터", aliases: ["Escape Simulator"], match: new RegExp("방탈출\\s*시뮬레이터(?!\\s*2)", "i") },
  { tag: "방탈출 시뮬레이터 2", aliases: ["Escape Simulator 2"], match: new RegExp("방탈출\\s*시뮬레이터\\s*2", "i") },
  { tag: "이터널 리턴", aliases: ["이터널리턴","이터널","Eternal Return"], match: new RegExp("이터널\\s*리턴", "i") },
  { tag: "로블록스", aliases: ["Roblox"], match: new RegExp("로블록스", "i") },
  { tag: "크레이지 아케이드", aliases: ["크아"], match: new RegExp("크아|크레이지\\s*아케이드", "i") },
  { tag: "배틀그라운드", aliases: ["배그","PUBG"], match: new RegExp("배그|배틀그라운드|pubg", "i") },
  { tag: "발로란트", aliases: ["VALORANT"], match: new RegExp("발로란트", "i") },
  { tag: "작혼", aliases: ["Mahjong Soul"], match: new RegExp("작혼", "i") },
  { tag: "VRChat", aliases: ["브챗","VR챗","vr챗","브이알챗","브이알챗"], match: new RegExp("vr챗|vrchat|브챗", "i") },
  { tag: "How to Fish", aliases: [], match: new RegExp("how\\s+to\\s+fish", "i") },
  { tag: "메챠카멜리온", aliases: [], match: new RegExp("메챠카멜리온", "i") },
  { tag: "피코파크", aliases: ["PICO PARK"], match: new RegExp("피코파크", "i") },
  { tag: "WASD", aliases: [], match: new RegExp("WASD", "i") },
  { tag: "Gamble with your friends", aliases: [], match: new RegExp("gamble\\s+with\\s+your\\s+friends", "i") },
  { tag: "머신파티", aliases: [], match: new RegExp("머신파티", "i") },
  { tag: "Moo Who", aliases: [], match: new RegExp("moo\\s+who", "i") },
  { tag: "Bottle Cracks", aliases: [], match: new RegExp("bottle\\s+cracks", "i") },
  { tag: "패들패들", aliases: [], match: new RegExp("패들패들", "i") },
  { tag: "방과후 운동장", aliases: [], match: new RegExp("방과후\\s*운동장", "i") },
  { tag: "마인크래프트", aliases: ["마크","Minecraft"], match: new RegExp("마크중독|마인크래프트|minecraft|그냥서버|더켓몬|폭주서버", "i") },
  { tag: "링피트", aliases: ["링 피트 어드벤처","Ring Fit Adventure"], match: new RegExp("링\\s*피트|ring\\s*fit", "i") },
  { tag: "에이징커브", aliases: ["에이징 커브"], match: new RegExp("에이징\\s*커브\\s*게임", "i") },
  { tag: "엘든 링", aliases: ["엘든링","Elden Ring"], match: new RegExp("엘든\\s*링|elden\\s*ring", "i") },
  { tag: "더 파이널스", aliases: ["더파이널스","THE FINALS"], match: new RegExp("더\\s*파이널스|the\\s*finals", "i") },
  { tag: "아르마 3", aliases: ["아르마","Arma 3"], match: new RegExp("아르마|arma\\s*3", "i") },
  { tag: "배틀크러쉬", aliases: ["배틀 크러쉬","BATTLE CRUSH"], match: new RegExp("배틀\\s*크러쉬|battle\\s*crush", "i") },
];

const topicRules: Array<[string, RegExp]> = [
  ["같이보기", new RegExp("같이보[기고]|같이본", "i")],
  ["음악", new RegExp("노래|음악|커버곡|보카로|플레이리스트|리스닝파티|싱크룸", "i")],
  ["노래방", new RegExp("노래방", "i")],
  ["커버곡", new RegExp("커버곡", "i")],
  ["노래대회", new RegExp("노래대회|노래자랑", "i")],
  ["보카로", new RegExp("보카로", "i")],
  ["제이팝", new RegExp("제이팝", "i")],
  ["케이팝", new RegExp("케이팝", "i")],
  ["노래연습", new RegExp("노래깎기", "i")],
  ["리스닝파티", new RegExp("리스닝파티", "i")],
  ["싱크룸", new RegExp("싱크룸", "i")],
  ["가챠", new RegExp("가챠|일뽑|픽업", "i")],
  ["시청자참여", new RegExp("시참|시청자|스코프", "i")],
  ["월드컵", new RegExp("월드컵", "i")],
  ["스코프", new RegExp("스코프", "i")],
  ["최애캐", new RegExp("최애캐", "i")],
  ["홈화면", new RegExp("홈화면", "i")],
  ["알고리즘", new RegExp("알고리즘", "i")],
  ["존댓말라디오", new RegExp("존댓말\\s*라디오", "i")],
  ["라디오", new RegExp("라디오", "i")],
  ["고민상담", new RegExp("고민상담|컨설팅", "i")],
  ["테스트", new RegExp("IQ\\s*테스트|MBTI\\s*검사", "i")],
  ["MBTI", new RegExp("MBTI", "i")],
  ["IQ", new RegExp("IQ", "i")],
  ["퀴즈", new RegExp("퀴즈", "i")],
  ["Q&A", new RegExp("Q&A|100문\\s*100답", "i")],
  ["회고", new RegExp("과거\\s*털기|과거털기|지난\\s*노래", "i")],
  ["설명회", new RegExp("설명회|알아보기|가이드", "i")],
  ["시청자어워드", new RegExp("시청자\\s*어워드", "i")],
  ["신의상", new RegExp("신의상|뉴의상", "i")],
  ["신모델", new RegExp("뉴노리", "i")],
  ["방셀", new RegExp("방셀", "i")],
  ["기념방송", new RegExp("기념|100일\\s*방송|200일|300일|지하돌\\s*\\d+주년", "i")],
  ["술먹방", new RegExp("술먹방", "i")],
  ["ASMR", new RegExp("ASMR", "i")],
  ["3DIO", new RegExp("3dio", "i")],
  ["얀데레", new RegExp("얀데레", "i")],
  ["풀트", new RegExp("풀트", "i")],
  ["모캡", new RegExp("모캡", "i")],
  ["VR", new RegExp("VR|브챗|촉각슈트", "i")],
  ["합방", new RegExp("합방|w\\.", "i")],
  ["대회", new RegExp("대회|최강자전|퀴즈쇼", "i")],
  ["지하돌", new RegExp("지하돌|지하아이돌", "i")],
  ["소통", new RegExp("소통|노가리", "i")],
  ["모뱅", new RegExp("모뱅|모바일\\s*야방", "i")],
  ["야외방송", new RegExp("야외|밤산책|모바일\\s*야방", "i")],
  ["작업방송", new RegExp("작업\\s*방송|작업뱅", "i")],
  ["그림", new RegExp("그림|그리기|그리는|그려|이모티콘\\s*만들기|티콘\\s*그리", "i")],
  ["카페탐방", new RegExp("카페", "i")],
  ["커머스", new RegExp("커머스", "i")],
  ["독서", new RegExp("독서|독서감상문", "i")],
  ["운동", new RegExp("운동|오운완|링피트", "i")],
  ["노방종", new RegExp("노방종|노리식방종", "i")],
  ["리방", new RegExp("리방", "i")],
  ["더켓몬2", new RegExp("더켓몬", "i")],
  ["그냥서버", new RegExp("그냥서버", "i")],
  ["폭주서버", new RegExp("폭주서버", "i")],
  ["포켓몬", new RegExp("포켓몬", "i")],
  ["건담", new RegExp("건담|수성의마녀", "i")],
  ["수성의마녀", new RegExp("수성의마녀", "i")],
  ["사이버펑크 엣지러너", new RegExp("사이버펑크\\s*엣지러너", "i")],
  ["사펑2", new RegExp("사펑2", "i")],
  ["죠죠의 기묘한 모험", new RegExp("죠죠의\\s*기묘한\\s*모험", "i")],
  ["초 카구야 공주", new RegExp("초\\s*카구야\\s*공주", "i")],
  ["메이저", new RegExp("메이저\\s*같이보기", "i")],
  ["야구", new RegExp("야구가리|WBC|한일전", "i")],
  ["코스프레", new RegExp("코스프레", "i")],
  ["타로", new RegExp("타로", "i")],
  ["SCP", new RegExp("SCP", "i")],
  ["서울가이드", new RegExp("서울\\s*가이드", "i")],
  ["빼빼로데이", new RegExp("빼빼로", "i")],
  ["입문", new RegExp("입문|첫\\s*플레이", "i")],
  ["찍먹", new RegExp("찍먹", "i")],
  ["스토리", new RegExp("스토리", "i")],
  ["룰렛", new RegExp("룰렛", "i")],
];

const extraAliases: Record<string, string[]> = {
  "모바일 방송": ["모뱅"],
  "카페": ["카페탐방", "카페 탐방"],
  "마크서버": ["마인크래프트 서버", "마크 서버"],
  "사이버펑크": ["사이버펑크 엣지러너", "사펑2", "사펑"],
  "시청자참여": [
    "시참",
    "시청자 참여"
  ],
  "모캡": [
    "모션 캡처",
    "모션캡처"
  ],
  "음악": [
    "노래"
  ],
  "같이보기": [
    "애니 같이보기",
    "영상 같이보기",
    "애니·영상 같이보기"
  ],
  "존댓말라디오": [
    "존댓말 라디오"
  ],
  "시청자어워드": [
    "시청자 어워드"
  ],
  "작업방송": [
    "작업 방송",
    "작업뱅"
  ],
  "더켓몬2": [
    "더켓몬",
    "더켓몬 2"
  ],
  "기념방송": [
    "기념 방송"
  ],
  "스코프": [
    "스코프 시리즈",
    "시청자 스코프"
  ],
  "외부합방": [
    "외부 합방"
  ],
  "메인스토리": [
    "메인 스토리"
  ],
  "이벤트스토리": [
    "이벤트 스토리"
  ],
  "복합방송": [
    "복합 방송"
  ],
  "신의상": [
    "뉴의상"
  ],
  "워프특급 살인사건": [
    "워특살",
    "워프 특급 살인 사건"
  ],
  "발푸르기스의 밤": [
    "발푸밤"
  ],
  "RED ASH": [
    "레드애쉬",
    "레드 애쉬"
  ],
  "LAST KINGDOM": [
    "라스트킹덤",
    "라스트 킹덤"
  ],
  "OLD TALES": [
    "올드테일즈",
    "올드 테일즈"
  ],
  "NEW YEAR, NEW SWORD": [
    "24신년",
    "신년 스토리"
  ],
  "시간살인시간": [
    "시간 살인 시간"
  ]
};

export function normalizeSearch(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase("ko-KR").replace(new RegExp("[^\\p{L}\\p{N}]", "gu"), "");
}

const aliasesByTag = new Map<string, string[]>([
  ...gameRules.map((rule): [string, string[]] => [rule.tag, rule.aliases]),
  ...Object.entries(extraAliases),
]);
const canonicalByAlias = new Map<string, string>();
for (const [tag, aliases] of aliasesByTag) {
  for (const alias of [tag, ...aliases]) canonicalByAlias.set(normalizeSearch(alias), tag);
}

export function canonicalizeTags(tags: readonly string[]): string[] {
  return Array.from(new Set(tags.map((tag) => {
    const clean = tag.replace(/^#+/, "").trim();
    return canonicalByAlias.get(normalizeSearch(clean)) ?? clean;
  }).filter(Boolean)));
}

export function tagSearchText(tag: string): string {
  const canonical = canonicalizeTags([tag])[0] ?? tag;
  return [canonical, ...(aliasesByTag.get(canonical) ?? [])].join(" ");
}

export function inferGames(title: string): string[] {
  return canonicalizeTags(gameRules.filter((rule) => rule.match.test(title)).map((rule) => rule.tag));
}

export function inferTags(title: string): string[] {
  const games = inferGames(title);
  const topics = topicRules.filter(([, pattern]) => pattern.test(title)).map(([tag]) => tag);
  if (games.length > 0 || /게임|종겜/.test(title)) topics.push("게임");
  if (
    topics.some((tag) => ["신의상", "신모델", "기념방송", "시청자어워드", "방셀"].includes(tag)) ||
    /(?:시청자|즐찾|생방|오운완)\s*이벤트|이벤트\s*(?:추첨|시작)|역팬데이/.test(title)
  ) topics.push("이벤트");
  return canonicalizeTags([...games, ...topics]);
}

const namedGameTags = new Set([
  "림버스 컴퍼니", "니케", "로보토미 코퍼레이션", "이환", "명조",
  "명일방주: 엔드필드", "트릭컬 리바이브", "오버필드", "블루 아카이브", "VRChat",
]);
const gameNames = new Set(gameRules.map(({ tag }) => tag));
const mergedTagGroups: Record<string, string[]> = {
  "스토리": ["메인스토리", "이벤트스토리"],
  "마크서버": ["마인크래프트", "더켓몬2", "폭주서버", "그냥서버", "마인크래프트 서버"],
  "종합게임": ["종겜", "일반 게임"],
  "토크·소통": ["토크", "소통"],
  "음악": ["노래방", "노래연습", "리스닝파티", "싱크룸"],
  "이벤트": ["기념방송", "특집"],
  "풀트·모캡": ["풀트", "모캡"],
  "ASMR": ["3DIO"],
  "합방": ["외부합방"],
  "신의상·모델": ["신의상", "신모델"],
  "테스트": ["MBTI", "IQ"],
  "서브컬쳐": ["서브컬처"],
  "건담": ["수성의마녀"],
};
const mergedTagNames = new Map(Object.entries(mergedTagGroups).flatMap(([tag, aliases]) => aliases.map((alias) => [alias, tag] as const)));
const hiddenTags = new Set(["복합방송", "리방", "찍먹", "입문", "노방종"]);

export function curateTags(tags: readonly string[], games: readonly string[] = []): string[] {
  const original = canonicalizeTags([...tags, ...games]);
  const hasGame = original.some((tag) => gameNames.has(tag) || tag === "마크서버" || mergedTagNames.get(tag) === "마크서버");
  return [...new Set(original.flatMap((tag) => {
    if (hiddenTags.has(tag)) return [];
    if (tag === "VR" && original.includes("VRChat")) return [];
    if (tag === "라디오" && original.includes("존댓말라디오")) return [];
    if (tag === "게임") return hasGame ? [] : ["종합게임"];
    if (mergedTagNames.has(tag)) return [mergedTagNames.get(tag)!];
    if (gameNames.has(tag) && !namedGameTags.has(tag)) return ["종합게임"];
    return [tag];
  }))];
}

const searchOnlyTags = new Set([
  "룰렛", "테스트", "독서", "얀데레", "워프특급 살인사건", "최애캐", "퀴즈", "회고", "Q&A", "VR",
  "메이저", "빼빼로데이", "죠죠의 기묘한 모험", "오버필드", "초 카구야 공주", "케이팝", "코스프레", "타로", "홈화면",
  "LAST KINGDOM", "NEW YEAR, NEW SWORD", "OLD TALES", "RED ASH", "SCP", "VRChat", "알고리즘",
]);

export function isVisibleTag(tag: string): boolean {
  return !searchOnlyTags.has(tag);
}

export function tagLabel(tag: string): string {
  return tag === "림버스 컴퍼니" ? "림버스컴퍼니" : tag === "스코프" ? "스코프 시리즈" : tag;
}

// Cloud aliases find the merged button; replay search still uses each replay's original terms.
export function tagCloudSearchText(tag: string): string {
  const aliases = mergedTagGroups[tag] ?? [];
  const games = tag === "종합게임" ? gameRules.filter(({ tag }) => !namedGameTags.has(tag) && tag !== "마인크래프트").map(({ tag }) => tag) : [];
  return [tag, ...aliases, ...games].map(tagSearchText).join(" ");
}
