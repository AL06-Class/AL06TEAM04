const recommendedCompanies = [
  {
    title: "라벤더랩스",
    meta: "재택 병행 · 주 4일 · 실무 과제 있음",
    badge: "완전 매칭",
    badgeStyle: "success"
  },
  {
    title: "퍼플워크",
    meta: "오전 집중근무 · 3.2km · 공고 2개",
    badge: "공고 연결됨",
    badgeStyle: "info"
  }
];

const valueCards = [
  {
    title: "위치 기반 유연근무",
    meta: "거리, 요일, 시간을 함께 비교해 실제로 출근 가능한 기업을 먼저 보여줍니다."
  },
  {
    title: "실무 과제 중심 매칭",
    meta: "공고와 과제를 연결해 지원자가 업무를 더 정확히 이해할 수 있게 합니다."
  },
  {
    title: "공통 컴포넌트 기준",
    meta: "Header, Button, Card, Badge, Form Field를 같은 기준으로 사용합니다."
  }
];

export default function App() {
  return (
    <div className="wd-page">
      <header className="wd-header">
        <div className="wd-logo">WONDERDOGs</div>
        <nav className="wd-nav" aria-label="주요 메뉴">
          <span className="wd-nav__active">기업 찾기</span>
          <span>인재 찾기</span>
          <span>채용 도우미</span>
          <span>이용 안내</span>
        </nav>
        <span className="wd-button wd-button--secondary">로그인</span>
      </header>

      <main className="wd-container">
        <section className="wd-hero" aria-labelledby="main-title">
          <div className="wd-panel wd-hero__copy">
            <p className="wd-eyebrow">디자인 시스템 적용 완료</p>
            <h1 className="wd-title" id="main-title">
              위치와 유연근무 조건이 맞는 채용을 더 빠르게 연결합니다.
            </h1>
            <p className="wd-description">
              WONDERDOGs 화면은 보라/라벤더 브랜드 톤, 명확한 카드형 정보,
              업무 도구 UI 기준을 함께 사용합니다.
            </p>
            <div className="wd-actions">
              <span className="wd-button wd-button--primary">기업 찾기</span>
              <span className="wd-button wd-button--secondary">구직자 찾기</span>
            </div>
          </div>

          <aside className="wd-panel wd-preview" aria-label="추천 기업 미리보기">
            <div className="wd-preview__map">지도 기반 추천 영역</div>
            <div className="wd-card-list">
              {recommendedCompanies.map((company) => (
                <article className="wd-card" key={company.title}>
                  <span className={`wd-badge wd-badge--${company.badgeStyle}`}>
                    {company.badge}
                  </span>
                  <h2 className="wd-card__title">{company.title}</h2>
                  <p className="wd-card__meta">{company.meta}</p>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="wd-section-grid" aria-label="핵심 가치">
          {valueCards.map((card) => (
            <article className="wd-card" key={card.title}>
              <h2 className="wd-card__title">{card.title}</h2>
              <p className="wd-card__meta">{card.meta}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
