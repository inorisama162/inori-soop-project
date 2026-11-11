export const siteConfig = {
  name: "이노리 컨텐츠 위키",
  description: "SOOP 버추얼 스트리머 이노리의 콘텐츠를 시리즈와 태그로 정리한 다시보기 위키",
  channelId: process.env.SOOP_CHANNEL_ID ?? "inorisama",
  soopApiBase: process.env.SOOP_API_BASE ?? "https://chapi.sooplive.com/api",
  stationUrl: "https://www.sooplive.com/station/inorisama",
  cacheSeconds: 86400,
} as const;

export type VodItem = {
  id: number;
  title: string;
  date: string;
  durationSeconds: number | null;
  views: number | null;
  url: string;
  category: string;
  thumbnailUrl: string | null;
};
