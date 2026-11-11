# 이노리 컨텐츠 위키

게시 주소: https://inorisama162.github.io/inori-soop-project/content-wiki/

기존 Pages의 main 브랜치 게시 설정을 유지합니다. `content-wiki/`는 게시 파일, `_content-wiki-source/`는 원본 코드입니다. 기존 다른 사이트 폴더는 수정하지 않습니다.

## 실행

이 폴더에서 Node.js 24로 `npm ci`, `npm run dev`를 실행합니다. `npm test`로 검증하고 `BASE_PATH=/inori-soop-project/content-wiki/ npm run build`로 빌드합니다.

## 자동 갱신

`.github/workflows/content-wiki.yml`이 매일 한국 시간 오전 9시 17분, 위키 원본 변경 시, 수동 실행 시 동작합니다. Actions의 **Update content wiki**에서 Run workflow를 누르면 즉시 실행할 수 있습니다. 별도 API 키는 필요 없습니다. GitHub 상황에 따라 예약 실행이 지연될 수 있습니다.

SOOP 공개 목록을 확인하고 `public/vods.json`에 새 다시보기와 제목·날짜·썸네일·길이를 보관합니다. 빌드 결과를 `content-wiki/`에 반영한 뒤 기존 Pages 사이트 재빌드를 요청합니다. 기존 분류·스토리 순서는 `lib/review-data.ts`, `lib/archive-data.ts`에서 보존하며, 새 방송은 제목 기반 태그와 검색으로 찾을 수 있습니다. 검토가 필요한 스토리 순서는 수동 분류합니다.

SOOP 응답이 불완전하거나 실패하면 작업이 실패로 표시되고 기존 게시 목록을 보존합니다. 목록에서 사라진 링크도 삭제하지 않습니다. 추천과 소개는 `lib/recommendations.ts`, 태그 규칙과 숨김 목록은 `lib/tag-utils.ts`에서 수정합니다. 현재 소개는 제목 기준이며 영상 전체 분석 결과가 아닙니다.

GitHub 공개 저장소는 장기간 활동이 없으면 예약을 중단할 수 있습니다. 갱신 성공 시 확인 시각과 목록을 커밋합니다. Actions에서 실행 결과를 확인할 수 있습니다.
