/* 각 문항의 targets에 해당하는 모든 멤버에게 선택 값 - 1 (0~4)점을 더합니다.
 * 멤버별 환산점수 = 획득점수 / (해당 문항 수 * 4) * 100.
 * sourceNumber는 사용자가 작성한 원래 번호이며 10번은 삭제되었습니다.
 * 화면에는 배열 순서대로 1~16번을 표시합니다. 순위와 동점은 반올림 전 비율로 결정합니다.
 */
window.SITE_CONFIG = {
  "version": "2026-09-30-v7",
  "cafeLinks": {
    "impressions": "https://cafe.naver.com/f-e/cafes/31568287/menus/101",
    "quiz": "https://cafe.naver.com/f-e/cafes/31568287/menus/101"
  },
  "anniversary": {
    "crewDays": 365,
    "auditionDays": 1346,
    "crewDuration": 1700,
    "auditionDuration": 3400
  },
  "slideshow": {
    "interval": 6500,
    "photos": [
      {
        "src": "./assets/memories/memory-10.webp",
        "alt": "유치원 교실에서 노란 모자를 쓰고 함께 모인 아바타들"
      },
      {
        "src": "./assets/memories/memory-09.webp",
        "alt": "대기실에서 나란히 모인 세 아바타"
      },
      {
        "src": "./assets/memories/memory-01.webp",
        "alt": "함께 모인 네 명의 지하아이돌 아바타"
      },
      {
        "src": "./assets/memories/memory-02.webp",
        "alt": "마인크래프트에서 나란히 선 세 캐릭터"
      },
      {
        "src": "./assets/memories/memory-03.webp",
        "alt": "두 멤버의 아바타와 여러 장면을 모은 방송 화면"
      },
      {
        "src": "./assets/memories/memory-04.jpg",
        "alt": "따뜻한 실내 배경과 갈색 머리 아바타"
      },
      {
        "src": "./assets/memories/memory-05.webp",
        "alt": "함께 팔로 하트를 만드는 두 아바타"
      },
      {
        "src": "./assets/memories/memory-06.webp",
        "alt": "한복을 입고 나란히 있는 두 아바타"
      },
      {
        "src": "./assets/memories/memory-07.webp",
        "alt": "나무 액자 속 수녀복을 입은 네 아바타"
      },
      {
        "src": "./assets/memories/memory-08.webp",
        "alt": "가까이 나란히 있는 빨간 머리와 검은 머리 아바타"
      }
    ]
  },
  "members": [
    {
      "id": "kokomi",
      "name": "코코미",
      "short": "코",
      "color": "#b8e4f5",
      "photo": "./assets/members/kokomi.webp",
      "birthday": "2006.12.29",
      "debut": "2025.10.05",
      "station": "https://www.sooplive.com/station/cocomizzang",
      "resultTitle": "빠른 재미와 트렌드를 즐기는 스트리머형",
      "resultDescription": "상대와 직접 겨루는 게임과 빠른 자극에 끌리고, SNS 트렌드에도 관심이 많은 타입이에요. 장난에 돌아오는 반응을 즐기며 떠오른 말을 바로 꺼내는 편이에요. 취향은 확실하고, 활발하게 지낼 여유가 없을 때는 조용히 있는 편이에요.",
      "tags": [
        "PvP와 빠른 재미",
        "트렌드 관심",
        "솔직한 반응"
      ]
    },
    {
      "id": "uaengdu",
      "name": "우앵두",
      "short": "앵",
      "color": "#b7d5ff",
      "photo": "./assets/members/uaengdu.webp",
      "birthday": "2004.03.31",
      "debut": "2025.10.05",
      "station": "https://www.sooplive.com/station/aengduwoo",
      "resultTitle": "차분한 대화와 도전을 즐기는 스트리머형",
      "resultDescription": "PvP 게임을 즐기면서도 친한 사람들과 이야기할 때는 잔잔한 농담을 건네는 타입이에요. 호불호가 분명하고, 솔직한 말은 오래 생각하고 정리해서 전해요. 공포게임이 힘들더라도 도전해서 이겨낼 수 있다고 생각하는 편이에요.",
      "tags": [
        "잔잔한 농담",
        "생각을 정리하는 대화",
        "공포도 도전"
      ]
    },
    {
      "id": "bbungchi",
      "name": "연토리 뿡치",
      "short": "뿡",
      "color": "#c4d5f3",
      "photo": "./assets/members/bbungchi.webp",
      "birthday": "2002.09.13",
      "debut": "2025.10.05",
      "station": "https://www.sooplive.com/station/bbungchi",
      "resultTitle": "공감하며 장난도 즐기는 스트리머형",
      "resultDescription": "주변 사람들의 제안에 잘 맞추고, 고민을 들으면 감정에 먼저 공감하는 타입이에요. 빠른 재미와 장난에 대한 반응을 즐기며, 대중적이지 않은 취향도 표현하고 싶어 해요. 공포·미스터리에 관심이 많고 겁도 상대적으로 적은 편이에요.",
      "tags": [
        "공감과 협력",
        "반응을 즐기는 장난",
        "공포·미스터리 관심"
      ]
    },
    {
      "id": "inori",
      "name": "이노리",
      "short": "마",
      "color": "#a8e9f4",
      "photo": "./assets/members/inori.webp",
      "birthday": "????.12.12",
      "debut": "2025.12.19",
      "station": "https://www.sooplive.com/station/inorisama",
      "resultTitle": "취향과 표현을 중요하게 생각하는 스트리머형",
      "resultDescription": "남들이 덜 아는 주제라도 좋아하는 마음을 드러내고 싶고, 싫어하는 것에 대한 기준도 확실한 타입이에요. 사진의 조명과 구도를 챙기며, 떠오른 말을 바로 꺼낸 뒤 되돌아보기도 해요. 활발하게 행동할 여유가 없으면 조용히 있는 편이에요.",
      "tags": [
        "확실한 취향",
        "사진의 완성도",
        "솔직한 표현"
      ]
    }
  ],
  "choices": [
    "거의 아니다",
    "아닌 편이다",
    "보통이다",
    "그런 편이다",
    "매우 그런 편이다"
  ],
  "questions": [
    {
      "id": "Q01",
      "sourceNumber": 1,
      "text": "플레이할 게임을 고른다면, 상대와 직접 겨루는 PvP 게임에 먼저 손이 간다.",
      "category": "게임 취향",
      "targets": [
        "kokomi",
        "uaengdu"
      ]
    },
    {
      "id": "Q02",
      "sourceNumber": 2,
      "text": "내 주변 사람들이 무언가를 하자고 하면, 내 방식을 고집하기보다 일단 맞춰주는 편이다.",
      "category": "협력 태도",
      "targets": [
        "bbungchi"
      ]
    },
    {
      "id": "Q03",
      "sourceNumber": 3,
      "text": "대중성이 떨어지더라도, 아는 사람만 아는 주제를 좋아하는 걸 표현하고 싶다.",
      "category": "취향 표현",
      "targets": [
        "inori",
        "bbungchi"
      ]
    },
    {
      "id": "Q04",
      "sourceNumber": 4,
      "text": "짧고 빠르게 재미와 자극이 오는 것에 끌린다.",
      "category": "취향 표현",
      "targets": [
        "kokomi",
        "bbungchi",
        "inori"
      ]
    },
    {
      "id": "Q05",
      "sourceNumber": 5,
      "text": "누군가 권해도 내가 싫어하는 것은 쉽게 마음이 바뀌지 않는다.",
      "category": "취향 표현",
      "targets": [
        "kokomi",
        "uaengdu",
        "inori"
      ]
    },
    {
      "id": "Q06",
      "sourceNumber": 6,
      "text": "누군가 고민을 털어놓으면, 해결책을 내놓기 전에 그 사람의 기분에 먼저 공감하게 된다.",
      "category": "소통 방식",
      "targets": [
        "bbungchi"
      ]
    },
    {
      "id": "Q07",
      "sourceNumber": 7,
      "text": "조금 수치스러운 상황을 만들거나 장난을 친 뒤, 그에 대한 반응 자체를 재미있게 즐기는 편이다.",
      "category": "소통 방식",
      "targets": [
        "bbungchi",
        "kokomi"
      ]
    },
    {
      "id": "Q08",
      "sourceNumber": 8,
      "text": "생각난 말은 바로 꺼내는 편이고, 끝나고 나서 표현을 후회할 때도 있다.",
      "category": "소통 방식",
      "targets": [
        "kokomi",
        "inori"
      ]
    },
    {
      "id": "Q09",
      "sourceNumber": 9,
      "text": "SNS에 올릴 사진은 조명·구도·초점을 챙기고, 예쁘게 안 나오면 아예 안 올리고 싶다.",
      "category": "일상 기록",
      "targets": [
        "inori"
      ]
    },
    {
      "id": "Q11",
      "sourceNumber": 11,
      "text": "누군가에게 솔직한 말을 해야 할 때는, 오랜 시간 생각하고 내용을 정리해서 꺼낸다.",
      "category": "소통 방식",
      "targets": [
        "uaengdu",
        "bbungchi"
      ]
    },
    {
      "id": "Q12",
      "sourceNumber": 12,
      "text": "활발한 모습을 연기할 여유가 없으면, 차라리 말없이 조용히 있는 편이다.",
      "category": "소통 방식",
      "targets": [
        "kokomi",
        "inori"
      ]
    },
    {
      "id": "Q13",
      "sourceNumber": 13,
      "text": "SNS 유행이나 트렌드에 민감하며, 잘 알고 있다.",
      "category": "트렌드 흥미",
      "targets": [
        "kokomi"
      ]
    },
    {
      "id": "Q14",
      "sourceNumber": 14,
      "text": "사람들이 나에게 사진을 잘 찍지 못한다고 말하는 경우가 많다.",
      "category": "일상 기록",
      "targets": [
        "uaengdu"
      ]
    },
    {
      "id": "Q15",
      "sourceNumber": 15,
      "text": "공포게임을 한다고 하면, 하기 힘들더라도 이겨낼 자신이 있다.",
      "category": "공포 면역",
      "targets": [
        "uaengdu"
      ]
    },
    {
      "id": "Q16",
      "sourceNumber": 16,
      "text": "공포나 미스터리에 관심이 많으며, 겁도 상대적으로 없는 편이다.",
      "category": "공포 면역",
      "targets": [
        "bbungchi"
      ]
    },
    {
      "id": "Q17",
      "sourceNumber": 17,
      "text": "친한 사람들과 대화를 할 때, 웃긴 농담을 하더라도 큰 소리보다는 잔잔하게 재미있는 말을 한다.",
      "category": "대화 방식",
      "targets": [
        "uaengdu"
      ]
    }
  ],
  "resultNotice": {
    "title": "이노리의 주관적인 테스트입니다",
    "body": "이 테스트는 지하아이돌 멤버 이노리가 멤버들의 컨펌을 받지 않고 제작했으므로, 극히 주관적일 수 있습니다.",
    "emphasis": "실제 방송 취향 혹은 최애 스트리머와는 무관합니다."
  }
};
