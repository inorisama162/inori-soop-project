import ArchiveClient from "./archive-client";
import { siteConfig } from "@/lib/site-config";

const publicLinks = [
  { label: "SOOP 방송국", href: siteConfig.stationUrl, mark: "S" },
  { label: "지하아이돌 카페", href: "https://cafe.naver.com/jihaidol", mark: "C" },
  { label: "이노리 YouTube", href: "https://www.youtube.com/@inorisama162", mark: "Y" },
  { label: "BUSINESS CONTACT", href: "mailto:inorisama162@gmail.com", mark: "@" },
];

export default function Home({ vodEndpoint }: { vodEndpoint?: string } = {}) {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="이노리 컨텐츠 위키 홈"><span className="wordmark-mark">I</span><span>이노리 컨텐츠 위키<small>INORI CONTENT WIKI</small></span></a>
        <nav aria-label="주요 메뉴"><a href="#series-title">모아보기</a><a href="#tag-cloud">태그</a><a href="#all-content">검색</a><a href={siteConfig.stationUrl} target="_blank" rel="noreferrer">SOOP ↗</a></nav>
      </header>

      <div id="top" className="page-shell">
        <section className="wiki-intro" aria-labelledby="page-title">
          <div className="intro-profile">
            {/* Public VTuber profile image; served directly to avoid a metered image proxy. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://profile.img.sooplive.com/LOGO/in/inorisama/inorisama.jpg" alt="버추얼 스트리머 이노리" referrerPolicy="no-referrer" />
            <span aria-hidden="true">✝</span>
          </div>
          <div className="intro-copy">
            <p className="section-kicker">SOOP VTUBER · INORI</p>
            <h1 id="page-title">이노리 컨텐츠 위키</h1>
            <details className="wiki-guide">
              <summary>컨텐츠 위키 설명서</summary>
              <div>
                <p>이노리의 지난 소통 / 합방 / 자체 컨텐츠 및 시리즈로 진행되는 컨텐츠를 더욱 찾아보기 편하게 만들었습니다.</p>
                <p>아래에서 게임이나 취향에 맞게 골라보실 수 있으며, 원하는 컨텐츠를 누르면 방송 다시보기로 바로 이동할 수 있습니다.</p>
                <p>업데이트는 AI 자동화 시스템을 이용하여 하루에 한 번 진행되며, 상황에 따라 지난 방송이 바로 반영되지 않을 수 있습니다.</p>
                <p>기능 오류는 이노리에게 얘기해주세요.</p>
              </div>
            </details>
          </div>
        </section>

        <section className="public-links" aria-label="이노리 공식 링크">
          {publicLinks.map((link) => <a key={link.label} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noreferrer" : undefined}><span>{link.mark}</span><strong>{link.label}</strong><small aria-hidden="true">↗</small></a>)}
        </section>

        <ArchiveClient vodEndpoint={vodEndpoint} />

        <details className="site-info"><summary>사이트 안내</summary><p>공개된 방송 정보만 사용하며, 다시보기 목록은 하루 단위로 확인합니다. 개인 계정 정보는 표시하지 않습니다.</p></details>
      </div>

      <footer><span>© 2026 INORI</span></footer>
    </main>
  );
}
