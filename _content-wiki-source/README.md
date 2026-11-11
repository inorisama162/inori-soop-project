# 이노리 컨텐츠 위키

SOOP 다시보기를 시리즈와 태그로 모아보는 사이트입니다. 검토된 235개 기록과 이후 공개 다시보기를 함께 표시합니다.

## 실행

Node.js 24에서 `npm ci` 후 `npm run dev`로 실행합니다. `npm test`, `npm run build`로 검증하고 빌드합니다.

## 게시 및 자동 갱신

저장소 Settings → Pages → Source를 **GitHub Actions**로 설정합니다. Actions의 **SOOP daily update and Pages**에서 Run workflow를 누르면 즉시 게시합니다.

매일 한국 시간 오전 9시 17분, main에 코드가 반영될 때, 수동 실행할 때 SOOP 공개 다시보기를 확인하고 GitHub Pages에 게시합니다. 별도 API 키는 사용하지 않습니다. GitHub 상황에 따라 예약 실행은 늦어질 수 있습니다.

- `public/vods.json`: 마지막으로 확인한 공개 목록. 새 방송 및 제목·날짜·썸네일·길이를 갱신합니다.
- `lib/review-data.ts`, `lib/archive-data.ts`: 검토한 분류와 스토리 순서. 자동 갱신이 덮어쓰지 않습니다.
- `lib/tag-utils.ts`: 새 방송의 제목을 보고 붙일 태그, 검색 별칭, 숨긴 태그.
- `lib/recommendations.ts`: 추천 순서와 접어서 보는 소개.

신규 방송은 검색과 태그에 반영됩니다. 스토리 장 순서처럼 검토가 필요한 분류는 기존 검토 자료를 유지합니다. SOOP 응답이 불완전하거나 실패하면 마지막 정상 목록으로 게시하며 Actions에 경고를 남깁니다. 목록에서 사라진 기존 링크도 삭제하지 않습니다. 현재 소개는 제목 기준이며 영상 전체 분석 결과가 아닙니다.

GitHub 공개 저장소는 장기간 저장소 활동이 없으면 예약을 중단할 수 있습니다. 갱신 성공 시 목록과 확인 시각을 커밋하며, Actions에서 실행 결과를 확인할 수 있습니다.
