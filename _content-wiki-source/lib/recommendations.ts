export const recommendedVods = [
  { id: 210079829, summary: "시청자들의 최애 캐릭터를 살펴보는 스코프 1편과 마크 ‘그냥서버’ 졸업이 담긴 방송입니다." },
  { id: 211177973, summary: "지하돌 멤버들과 함께하는 VRChat MT 합방. 니케 30장 스토리와 마리안 픽업도 함께 담긴 방송입니다." },
  { id: 209922717, summary: "300일을 맞아 지뢰계 신의상을 공개한 기념 방송. 얀데레 콘셉트의 3DIO ASMR도 함께 담겨 있습니다." },
  { id: 205315713, summary: "이노리가 가장 못하는 게임을 맞혀 보는 ‘가못겜’. 어떤 게임이 가장 어려울지 예상하며 볼 수 있는 자체 컨텐츠입니다." },
  { id: 200659991, summary: "방송 200일을 기념한 연령제한 방송입니다." },
] as const;

export const recommendedIds = new Set<number>(recommendedVods.map(({ id }) => id));
export const recommendationSummary = new Map<number, string>(recommendedVods.map(({ id, summary }) => [id, summary]));
export const summaryBasis = "방송 제목 기준 · 전체 영상 분석 전";
