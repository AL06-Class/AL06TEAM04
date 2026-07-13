import { PageContainer } from "../components/common/PageContainer";

export function PendingRoutePage() {
  return (
    <div className="wd-company-page">
      <PageContainer>
        <section className="wd-page-heading">
          <h1>페이지 준비 중</h1>
          <p>요청한 화면은 아직 연결되지 않았습니다.</p>
          <p>
            <a href="/company">기업 대시보드로 이동</a>
          </p>
        </section>
      </PageContainer>
    </div>
  );
}
