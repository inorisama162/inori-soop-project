export function mergeSnapshot(previous, incoming) {
  if (incoming.unavailable || incoming.partial || !Array.isArray(incoming.items) || incoming.items.length === 0 || !incoming.updatedAt) {
    throw new Error("SOOP 목록을 완전히 확인하지 못했습니다. 기존 데이터는 변경하지 않습니다.");
  }
  const byId = new Map((previous.items ?? []).map((item) => [item.id, item]));
  for (const item of incoming.items) {
    if (!Number.isSafeInteger(item.id) || item.id < 1 || !item.title || !/^\d{4}-\d{2}-\d{2}$/.test(item.date) || item.url !== `https://vod.sooplive.com/player/${item.id}`) {
      throw new Error("검증되지 않은 다시보기 정보가 있어 갱신을 중단합니다.");
    }
    byId.set(item.id, item);
  }
  return {
    items: [...byId.values()].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id),
    updatedAt: incoming.updatedAt,
    source: "SOOP 공개 다시보기",
    partial: false,
    pagesFetched: incoming.pagesFetched,
    sourceTotal: incoming.sourceTotal,
  };
}
