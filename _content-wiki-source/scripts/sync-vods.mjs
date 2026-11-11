import { readFile, writeFile, rename } from "node:fs/promises";
import { resolve } from "node:path";
import { createServer } from "vite";
import { mergeSnapshot } from "./snapshot.mjs";

const target = resolve("public/vods.json");
const previous = JSON.parse(await readFile(target, "utf8"));
const vite = await createServer({ configFile: false, resolve: { alias: { "@": process.cwd() } }, optimizeDeps: { noDiscovery: true }, server: { middlewareMode: true, hmr: false, watch: null } });
try {
  const { GET } = await vite.ssrLoadModule("/app/api/vods/route.ts");
  let snapshot;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await GET();
      if (!response.ok) throw new Error(`SOOP 목록 응답 오류: ${response.status}`);
      snapshot = mergeSnapshot(previous, await response.json());
      break;
    } catch (error) {
      if (attempt === 3) throw error;
      console.warn(`SOOP 목록 확인 재시도 ${attempt}/3`);
      await new Promise((done) => setTimeout(done, attempt * 2000));
    }
  }
  await writeFile(target + ".tmp", JSON.stringify(snapshot, null, 2) + "\n");
  await rename(target + ".tmp", target);
  console.log(`${snapshot.items.length}개 다시보기 · 갱신 ${snapshot.updatedAt}`);
} finally {
  await vite.close();
}
