import { publicArchiveItems } from "./review-data";
import { canonicalizeTags, curateTags, inferGames, inferTags } from "./tag-utils";
import { recommendedIds } from "./recommendations";

export type StoryEntry = {
  game: "limbus" | "nikke";
  kind: "main" | "event" | "other" | "pending";
  key: string;
  label: string;
  order: number;
  part?: string;
  note?: string;
};

export type ArchiveItem = {
  id: number;
  title: string;
  broadcastTitle: string;
  tags: string[];
  searchTags?: string[];
  groups: string[];
  games?: string[];
  stories?: StoryEntry[];
  date: string;
  url: string;
  rating: number;
  thumbnailUrl?: string;
  durationSeconds?: number | null;
  auto?: boolean;
  sourceStatus?: "listed" | "retained";
};

const manualArchiveItems: ArchiveItem[] = [
  {id:200545869,title:"버킷 리스트 만들기",broadcastTitle:"💬(리방)버킷리스트 만들기 + 니케 수렐루 수로시 가챠 및 후열",tags:["시참","토크"],groups:[],date:"2026-07-04",url:"https://vod.sooplive.com/player/200545869",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260704_7F1089FE_295320417_2_r"},
  {id:200464797,title:"림버스 컴퍼니 (4.5장)",broadcastTitle:"🎮림버스컴퍼니 4.5장 + 로보토미 코퍼레이션 2일차",tags:["서브컬처","게임"],groups:["림버스 컴퍼니"],date:"2026-07-03",url:"https://vod.sooplive.com/player/200464797",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260703_EC970CBE_295291801_2_r"},
  {id:200270021,title:"100문 100답",broadcastTitle:"💬100문 100답 작성하기",tags:["토크"],groups:[],date:"2026-07-02",url:"https://vod.sooplive.com/player/200270021",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260701_1A5D3CF5_295241255_1_r&column=2&t=1782975114"},
  {id:199969379,title:"스코프 시리즈 시즌3 (좋아요)",broadcastTitle:"💬소통컨텐츠 [시청자 좋아요 스코프]",tags:["시참"],groups:["스코프 시리즈"],date:"2026-06-28",url:"https://vod.sooplive.com/player/199969379",rating:4,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260628_92F2B0ED_295169159_1_r&column=2&t=1782975095"},
  {id:199837371,title:"지하돌 게임 합방 (메이플)",broadcastTitle:"🎮지하돌 메이플 하드윌 보스레이드 분탕치기",tags:["지하돌","게임"],groups:["지하돌 게임합방"],date:"2026-06-27",url:"https://vod.sooplive.com/player/199837371",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260627_672F1950_295138707_1_r&column=2&t=1782975038"},
  {id:199759439,title:"지하돌 게임 합방 (폭탄해체)",broadcastTitle:"🎮폭탄해체게임 w.우앵두 + 로보토미 1일차",tags:["지하돌","게임"],groups:["지하돌 게임합방"],date:"2026-06-26",url:"https://vod.sooplive.com/player/199759439",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260626_ACFA3249_295112659_1_r&column=2&t=1782974871"},
  {id:199191887,title:"지하돌 게임 합방 (메챠카멜리온)",broadcastTitle:"🎮지하돌 메챠카멜리온 + 피코파크 합방",tags:["지하돌","게임"],groups:["지하돌 게임합방"],date:"2026-06-20",url:"https://vod.sooplive.com/player/199191887",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260620_D288E794_294958255_1_r&column=2&t=1782974926"},
  {id:198616009,title:"림버스 컴퍼니 (4장)",broadcastTitle:"🎮숲 림버스부흥위원회장의 림버스 4장 슈웃",tags:["서브컬처","게임"],groups:["림버스 컴퍼니"],date:"2026-06-14",url:"https://vod.sooplive.com/player/198616009",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260613_D0D013DC_294783929_1_r&column=2&t=1782975797"},
  {id:198313283,title:"사이버펑크 엣지러너 같이보기",broadcastTitle:"🍿사이버펑크 엣지러너 같이보기 폭풍오열 ㅠㅠ",tags:["서브컬처"],groups:["애니 같이보기"],date:"2026-06-11",url:"https://vod.sooplive.com/player/198313283",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260610_F2B18EBE_294706363_2_r"},
  {id:198007205,title:"지하돌 게임 합방 (협동게임)",broadcastTitle:"🎮정신나갈것같은 지하돌 협동게임 합방 w. 뿡치, 우앵두",tags:["지하돌","게임"],groups:["지하돌 게임합방"],date:"2026-06-07",url:"https://vod.sooplive.com/player/198007205",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260607_BD001D24_294627051_1_r"},
  {id:197312017,title:"뉴노리 공개 모캡",broadcastTitle:"🎉뉴노리 공개 모캡 방송! 새로운 이몸을 맞이해줘✝️ (즐찾, 생방 이벤트)",tags:["모션 캡처"],groups:[],date:"2026-05-31",url:"https://vod.sooplive.com/player/197312017",rating:5,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260531_38805947_294445251_1_r&column=2&t=1782973312"},
  {id:196728871,title:"장지수용소 듀엣 노래자랑",broadcastTitle:"📺장지수용소 듀엣 노래자랑 참여! 지하돌이 뭔지 보여드리겠습니다 w. 포포",tags:["외부 합방","노래"],groups:[],date:"2026-05-25",url:"https://vod.sooplive.com/player/196728871",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260525_899EF3B1_294283265_2_r"},
  {id:196085549,title:"로블록스 시참",broadcastTitle:"🎮로블록스 시참을 해주시면 안될까요",tags:["시참","게임"],groups:[],date:"2026-05-18",url:"https://vod.sooplive.com/player/196085549",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260518_64EBA976_294108327_1_r"},
  {id:195866953,title:"보카로 노래대회",broadcastTitle:"📺코이님 보카로 노래대회",tags:["외부 합방","서브컬처","노래"],groups:[],date:"2026-05-16",url:"https://vod.sooplive.com/player/195866953",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260516_6A6DD117_294052293_1_r"},
  {id:194919535,title:"니케놀이",broadcastTitle:"📺이노리버렐리오의 니케놀이2 w.독고혜지,새라새라,별나무,버터우스3세,부정형인간,특별출연 비즈니스킴",tags:["외부 합방","서브컬처","풀트"],groups:["니케"],date:"2026-05-09",url:"https://vod.sooplive.com/player/194919535",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260506_60F075EF_293800293_2_r"},
  {id:195189223,title:"VR챗 풀트",broadcastTitle:"🥽VR챗 풀트 (다시보기 끊김)",tags:["풀트"],groups:[],date:"2026-05-09",url:"https://vod.sooplive.com/player/195189223",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260509_A13423B8_293875465_1_r"},
  {id:194778647,title:"[지하유치원]",broadcastTitle:"2시) [지하유치원] 어린이날 기념 지하돌 합방! w. 앙누나",tags:["지하돌"],groups:[],date:"2026-05-05",url:"https://vod.sooplive.com/player/194778647",rating:5,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260505_B031E032_293765635_1_r&column=2&t=1780408848"},
  {id:194489363,title:"지하돌 게임 합방 (방탈출 시뮬레이터)",broadcastTitle:"방탈출 시뮬레이터 (w. 우앵두, 연토리 뿡치)",tags:["지하돌","게임"],groups:["지하돌 게임합방"],date:"2026-05-02",url:"https://vod.sooplive.com/player/194489363",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260502_D69D5F0B_293685549_1_r"},
  {id:194421873,title:"림버스 컴퍼니 (3.5장)",broadcastTitle:"림버스 컴퍼니 3.5장 + 만우절 1-2 스토리 + 후열 수감자들 첫인상, 현인상 림가리",tags:["서브컬처","게임"],groups:["림버스 컴퍼니"],date:"2026-05-01",url:"https://vod.sooplive.com/player/194421873",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260501_F780FA25_293663147_2_r"},
  {id:193851553,title:"림버스 컴퍼니 (3장)",broadcastTitle:"서브컬쳐 맛집 스트리머의 림버스 컴퍼니 3장",tags:["서브컬처","게임"],groups:["림버스 컴퍼니"],date:"2026-04-26",url:"https://vod.sooplive.com/player/193851553",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260425_A90392EE_293506311_4_r"},
  {id:193738083,title:"스코프 시리즈 시즌2 (홈화면)",broadcastTitle:"[시청자 홈화면 스코프] 시청자들의 홈화면 상태는 과연?!",tags:["시참"],groups:["스코프 시리즈"],date:"2026-04-24",url:"https://vod.sooplive.com/player/193738083",rating:4,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260424_6B85E21A_293479669_1_r"},
  {id:192587891,title:"림버스 컴퍼니 (1~2장)",broadcastTitle:"프문 뉴비의 림버스컴퍼니 프롤로그부터 1-2장까지 | 림저씨라면 꼭 보러올것",tags:["서브컬처","게임"],groups:["림버스 컴퍼니"],date:"2026-04-13",url:"https://vod.sooplive.com/player/192587891",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260412_90FA548A_293167869_1_r&column=2&t=1776338462"},
  {id:192093263,title:"죠죠 같이보기",broadcastTitle:"죠죠의 기묘한 모험 1부 이노리와 같이보기 [애니 같이보기 핀볼]",tags:["서브컬처"],groups:["애니 같이보기"],date:"2026-04-08",url:"https://vod.sooplive.com/player/192093263",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260407_A50FF599_293036837_1_r&column=2&t=1775613316"},
  {id:191877127,title:"서울 가이드",broadcastTitle:"서울 토박이의 서울 가이드 | 이노리 + 서번트들의 서울 명소&맛집 추천🏙️",tags:["토크"],groups:["토크컨텐츠"],date:"2026-04-05",url:"https://vod.sooplive.com/player/191877127",rating:5,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260405_7E938042_292980417_1_r&column=2&t=1775613333"},
  {id:191455183,title:"가능충 케이크",broadcastTitle:"이노리 X 뿡치 만우절 합방 [가능충 케이크] | 가능의 끝을 보여드립니다 ^ ^",tags:["지하돌","토크"],groups:["토크컨텐츠"],date:"2026-04-01",url:"https://vod.sooplive.com/player/191455183",rating:5,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260401_8B691537_292868965_1_r&column=2&t=1775613374"},
  {id:190963801,title:"스코프 시리즈 시즌1 (알고리즘)",broadcastTitle:"시청자 알고리즘 스코프 + 숲 마스코트 모에화 그림방송",tags:["시참"],groups:["스코프 시리즈"],date:"2026-03-27",url:"https://vod.sooplive.com/player/190963801",rating:4,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260327_9E6BC43C_292737243_1_r&column=2&t=1774660001"},
  {id:190579587,title:"포켓몬 안 보고 그리기",broadcastTitle:"이노리의 포켓몬 안 보고 그리기",tags:["그림"],groups:[],date:"2026-03-23",url:"https://vod.sooplive.com/player/190579587",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260323_53E0D539_292628681_2_r&column=2&t=1774330514"},
  {id:190289993,title:"[오타쿠 최강자전]",broadcastTitle:"주최 컨텐츠 [오타쿠 최강자전] 숲 최강 오타쿠는 과연!?",tags:["외부 합방","서브컬처"],groups:["오타쿠 최강자전"],date:"2026-03-20",url:"https://vod.sooplive.com/player/190289993",rating:5,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260320_A0BF0CFE_292546231_1_r&column=2&t=1774330652"},
  {id:190071097,title:"촉각슈트 풀트 방송",broadcastTitle:"뭔가 이상한 촉각슈트 풀트 방송",tags:["풀트"],groups:[],date:"2026-03-18",url:"https://vod.sooplive.com/player/190071097",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260318_CF074D52_292489979_1_r&column=2&t=1774330731"},
  {id:189408453,title:"시청자 퀴즈쇼",broadcastTitle:"시청자 퀴즈쇼 + 이노리 찐생일 공개",tags:["시참"],groups:["토크컨텐츠"],date:"2026-03-11",url:"https://vod.sooplive.com/player/189408453",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260311_BAD643DA_292299473_1_r&column=2&t=1774331125"},
  {id:189098905,title:"골프게임 합방",broadcastTitle:"지하돌 제우스 스위데 골프게임 합방 + 작혼 + 후열 인생가리",tags:["외부 합방","지하돌","게임"],groups:[],date:"2026-03-08",url:"https://vod.sooplive.com/player/189098905",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260308_2E6F102B_292217573_1_r&column=2&t=1773140637"},
  {id:189017703,title:"디한이의 마음을 움직여라",broadcastTitle:"WBC 한일전 같이보기 사이에 섄디한님 컨텐츠 브챗풀트!!",tags:["외부 합방","풀트"],groups:[],date:"2026-03-07",url:"https://vod.sooplive.com/player/189017703",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260307_98206CB7_292194025_1_r&column=2&t=1773140876"},
  {id:188324383,title:"SCP 알아보기",broadcastTitle:"심야방송: SCP 알아보기 + 후열 로보토미 찍먹",tags:["토크"],groups:["토크컨텐츠"],date:"2026-03-01",url:"https://vod.sooplive.com/player/188324383",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260228_A58153E9_292012381_1_r&column=2&t=1773142155"},
  {id:188200571,title:"모뱅 260228",broadcastTitle:"이노리님에게서 전화가 왔습니다",tags:["모뱅"],groups:[],date:"2026-02-28",url:"https://vod.sooplive.com/player/188200571",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260227_E59C5825_291985327_1_r&column=2&t=1774331173"},
  {id:187962333,title:"[존댓말 라디오] 2화",broadcastTitle:"2부)존댓말 라디오 2화 | 퇴근라디오",tags:["시참","토크"],groups:["존댓말 라디오"],date:"2026-02-25",url:"https://vod.sooplive.com/player/187962333",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260225_303E943D_291916702_1_r&column=2&t=1774331249"},
  {id:187571129,title:"운동 룰렛",broadcastTitle:"운동룰렛과 수상한 업보 수행",tags:["풀트"],groups:[],date:"2026-02-21",url:"https://vod.sooplive.com/player/187571129",rating:4,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260221_61300980_291804524_1_r&column=2&t=1771905686"},
  {id:187259019,title:"지하돌 설날 합방",broadcastTitle:"니케 입문 (w. 독고혜지) + 지하돌 설날 게임 합방",tags:["지하돌","게임"],groups:["지하돌 게임합방"],date:"2026-02-18",url:"https://vod.sooplive.com/player/187259019",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260218_0B8CB837_291714610_1_r&column=2&t=1771551492"},
  {id:187098443,title:"주운컵",broadcastTitle:"주운컵 자운1팀 이노리 출전(뽀린걸, 재수피기, 아야네세나, 돗챠)",tags:["외부 합방","게임"],groups:[],date:"2026-02-17",url:"https://vod.sooplive.com/player/187098443",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260216_418E610E_291672808_1_r&column=2&t=1771341238"},
  {id:186867809,title:"발렌타인데이 신의상",broadcastTitle:"발렌타인데이 신의상 공개 + PICO VR 풀트 춤뱅",tags:["풀트"],groups:[],date:"2026-02-14",url:"https://vod.sooplive.com/player/186867809",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260214_BD233D44_291617306_1_r&column=2&t=1771340408"},
  {id:186673899,title:"숲 용어 알아보기",broadcastTitle:"셀프 건피(이노리 데뷔뱅 같이보기) + 숲 용어 알아보기",tags:["토크"],groups:["토크컨텐츠"],date:"2026-02-12",url:"https://vod.sooplive.com/player/186673899",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260212_202233BD_291561884_1_r&column=2&t=1771340222"},
  {id:186540251,title:"지하돌 게임 합방 (방탈출 시뮬레이터)",broadcastTitle:"방탈출 시뮬레이터 w.우앵두",tags:["지하돌","게임"],groups:["지하돌 게임합방"],date:"2026-02-11",url:"https://vod.sooplive.com/player/186540251",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260211_C4E81BB8_291528990_1_r&column=2&t=1771339641"},
  {id:186460561,title:"오버필드",broadcastTitle:"소통+오버필드+후읽시 | 감기라 목소리 이상함",tags:["서브컬처","게임"],groups:["서브컬처 게임찍먹"],date:"2026-02-10",url:"https://vod.sooplive.com/player/186460561",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260210_B805F9EC_291505820_1_r&column=2&t=1770774512"},
  {id:186276057,title:"트릭컬",broadcastTitle:"트릭컬 리바이브 플레이 | 가챠 + 스토리",tags:["서브컬처","게임"],groups:["서브컬처 게임찍먹"],date:"2026-02-08",url:"https://vod.sooplive.com/player/186276057",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260208_C20C8B21_291450632_1_r&column=2&t=1770774802"},
  {id:186165107,title:"보카로 빙고",broadcastTitle:"보카로 빙고 노래방 + and Roger 즙 플레이 + 릴동파 핀볼 같이보기",tags:["서브컬처"],groups:[],date:"2026-02-07",url:"https://vod.sooplive.com/player/186165107",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260207_7D479014_291422880_1_r&column=2&t=1770775103"},
  {id:185770565,title:"그림 그려주기",broadcastTitle:"그림 방송 | 숲 버추얼 스트리머 + 지하돌 신청받고 그리기",tags:["시참","그림"],groups:[],date:"2026-02-02",url:"https://vod.sooplive.com/player/185770565",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260203_A6764FBA_291303932_1_r&column=2&t=1770775651"},
  {id:185259813,title:"지하돌 3주년 합방",broadcastTitle:"지하돌 3주년 | 팬덤명 정하기 + 후열 회식",tags:["지하돌"],groups:[],date:"2026-01-29",url:"https://vod.sooplive.com/player/185259813",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260129_EBA108B1_291168066_1_r&column=2&t=1769906083"},
  {id:184879635,title:"과거털기 시즌2 (편지)",broadcastTitle:"살면서 받은 편지 읽어보기 | 과거털기 시즌 2",tags:["토크"],groups:["토크컨텐츠"],date:"2026-01-25",url:"https://vod.sooplive.com/player/184879635",rating:4,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260125_621C5451_291059344_1_r&column=2&t=1769610533"},
  {id:184695409,title:"초 카구야 공주 같이보기",broadcastTitle:"명일방주: 엔드필드 (가챠O) + 초 카구야 공주 같이보기",tags:["서브컬처"],groups:["애니 같이보기"],date:"2026-01-24",url:"https://vod.sooplive.com/player/184695409",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260123_22BC82B6_291003648_1_r&column=2&t=1769609984"},
  {id:184569971,title:"뿡치 에겐녀 컨설팅",broadcastTitle:"뿡치 에겐녀 컨설팅 합방 + 짧 보카로 노래방",tags:["지하돌"],groups:[],date:"2026-01-22",url:"https://vod.sooplive.com/player/184569971",rating:5,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260122_613EE056_290974690_1_r&column=2&t=1769609636"},
  {id:184385999,title:"오타쿠 설명회",broadcastTitle:"이노리의 오타쿠 설명회",tags:["서브컬처"],groups:["토크컨텐츠"],date:"2026-01-20",url:"https://vod.sooplive.com/player/184385999",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260120_54DE098D_290919668_1_r&column=2&t=1769059652"},
  {id:184084235,title:"지하돌 게임 합방 (배틀 그라운드)",broadcastTitle:"배린이의 지하돌 배그 합방 | 미션파티다 미션파티!!",tags:["지하돌","게임"],groups:["지하돌 게임합방"],date:"2026-01-17",url:"https://vod.sooplive.com/player/184084235",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260117_70F27F91_290833204_1_r&column=2&t=1769059783"},
  {id:183688893,title:"구독티콘 그리기",broadcastTitle:"시청자들 미소녀로 만들기 | 구독티콘 그리기",tags:["그림"],groups:[],date:"2026-01-13",url:"https://vod.sooplive.com/player/183688893",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260113_369EFABF_290727078_1_r&column=2&t=1768306926"},
  {id:183334495,title:"모뱅 260110",broadcastTitle:"[모뱅] 여행 간 이노리로부터 전화가 온다면?",tags:["모뱅"],groups:[],date:"2026-01-10",url:"https://vod.sooplive.com/player/183334495",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260110_572060B4_290638058_1_r&column=2&t=1768192952"},
  {id:183056645,title:"알까기 시참",broadcastTitle:"알까기 시참 이기면 이노리 디스 가능 | 시참 컨텐츠 + 이터널리턴",tags:["시참","게임"],groups:[],date:"2026-01-07",url:"https://vod.sooplive.com/player/183056645",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260107_F2A9D12B_290559376_1_r&column=2&t=1768190970"},
  {id:182971301,title:"[존댓말 라디오] 1화",broadcastTitle:"[존댓말 라디오] 1화 | SOOP의 퇴근음악 컨텐츠와 함께합니다",tags:["시참","토크"],groups:["존댓말 라디오"],date:"2026-01-06",url:"https://vod.sooplive.com/player/182971301",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260106_782F27D9_290536464_1_r&column=2&t=1768191646"},
  {id:182702149,title:"과거털기 시즌1 (지하돌)",broadcastTitle:"이노리 과거 털기 시즌 1 | 지하돌 지난 노래, 방송 같이보기 (내수의 날)",tags:["토크"],groups:["과거 털기"],date:"2026-01-03",url:"https://vod.sooplive.com/player/182702149",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20260103_F281E9AF_290460146_1_r&column=2&t=1768193359"},
  {id:182397949,title:"노리캐치",broadcastTitle:"햄버거 캐치로 시청자들 농락하기ㅋㅋㅋㅋㅋ | 2026 카운트다운",tags:["시참"],groups:[],date:"2026-01-01",url:"https://vod.sooplive.com/player/182397949",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20251231_6D3DB1F3_290390112_1_r&column=2&t=1767212557"},
  {id:182204195,title:"버숲페 참가",broadcastTitle:"데뷔 2주차에 버숲페 가는 법 | 버숲페 이노리 시점",tags:["지하돌","외부 합방"],groups:[],date:"2025-12-30",url:"https://vod.sooplive.com/player/182204195",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20251229_F7BD6DF9_290335184_1_r&column=2&t=1767150069"},
  {id:182238625,title:"오타쿠 노래방",broadcastTitle:"휴방날 기습 오타쿠 노래방",tags:["서브컬처"],groups:[],date:"2025-12-30",url:"https://vod.sooplive.com/player/182238625",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20251230_BD8E9C6F_290350878_1_r&column=2&t=1767151248"},
  {id:181803729,title:"풀 트래커 춤방",broadcastTitle:"첫 풀트 춤방 끝내고 즙 짠 스트리머",tags:["풀트"],groups:[],date:"2025-12-26",url:"https://vod.sooplive.com/player/181803729",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20251225_F3467CD5_290243184_1_r&column=2&t=1766759992"},
  {id:181609753,title:"지하돌 싱크룸 런치쇼",broadcastTitle:"지하돌 싱크룸 런치쇼 합방 (*음향세팅 정신없음 주의)",tags:["지하돌"],groups:[],date:"2025-12-24",url:"https://vod.sooplive.com/player/181609753",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20251224_F3545E6E_290200538_1_r&column=2&t=1766577799"},
  {id:181318245,title:"블루아카이브 첫 찍먹 실황",broadcastTitle:"여자친구가 생겼습니다... | 블루아카이브 첫 찍먹 실황",tags:["서브컬처","게임"],groups:["서브컬처 게임찍먹"],date:"2025-12-21",url:"https://vod.sooplive.com/player/181318245",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20251221_D9842682_290123810_1_r&column=2&t=1766388538"},
  {id:181267307,title:"시청자 vs 이노리 Q&A 대결",broadcastTitle:"시간 내에 대답하지 못하면 방종 연장?! | 시청자 vs 이노리 Q&A 대결",tags:["시참"],groups:[],date:"2025-12-20",url:"https://vod.sooplive.com/player/181267307",rating:0,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20251220_3619BE08_290106820_1_r&column=2&t=1766406102"},
  {id:181163431,title:"이노리 SOOP 정식 데뷔✝️",broadcastTitle:"이노리 SOOP 정식 데뷔✝️ 이몸의 등장이시당~",tags:["풀트"],groups:[],date:"2025-12-19",url:"https://vod.sooplive.com/player/181163431",rating:4,thumbnailUrl:"https://videoimg.sooplive.com/php/SnapshotLoad.php?rowKey=20251219_0462525F_290083468_1_r&column=2&t=1766392103"},
];

const byId = new Map<number, ArchiveItem>(publicArchiveItems.map((item) => [item.id, item]));
for (const manual of manualArchiveItems) {
  const current = byId.get(manual.id);
  if (current) {
    byId.set(manual.id, {
      ...manual,
      ...current,
      title: manual.title,
      rating: manual.rating,
      thumbnailUrl: manual.thumbnailUrl || current.thumbnailUrl,
      tags: canonicalizeTags([...manual.tags, ...current.tags]),
    });
  } else {
    const games = inferGames(manual.broadcastTitle);
    const groups = manual.date >= "2025-12-19" && /지하돌.*합방/.test(manual.broadcastTitle)
      ? ["지하돌 합방"] : [];
    byId.set(manual.id, {
      ...manual,
      groups,
      games,
      stories: [],
      tags: canonicalizeTags([...manual.tags, ...inferTags(manual.broadcastTitle)]),
      sourceStatus: "retained",
    });
  }
}

export const archiveItems: ArchiveItem[] = Array.from(byId.values())
  .map((item) => ({
    ...item,
    rating: recommendedIds.has(item.id) ? 5 : item.rating === 5 ? 0 : item.rating,
    searchTags: canonicalizeTags(item.tags),
    tags: curateTags(item.tags, item.games),
    groups: item.groups.map((group) => group === "기타 스토리 게임" ? "기타 서브컬쳐" : group),
  }))
  .map((item) => item.date < "2025-12-19" ? { ...item, groups: [], stories: [] } : item)
  .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
