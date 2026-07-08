import { useMemo, useState } from "react";
import flexibleJobsMapMockup from "../assets/map-mockup-flexible-jobs.png";
import wonderdogsLogo from "../assets/wonderdogs-logo.png";
import { Button } from "../components/common/Button";
import { PageContainer } from "../components/common/PageContainer";
import { PublicHeaderNav } from "../components/common/PublicHeaderNav";
import { flexibleJobCompanies } from "../mocks/flexibleJobs";

type LocationMode = "current" | "subway" | "address";
type SortMode = "match" | "distance";

const quickFilters = [
  { key: "career", label: "경력 전체" },
  { key: "quickStart", label: "즉시 가능" },
  { key: "remote", label: "부분 재택 선호" }
] as const;

export function FlexibleJobsPage() {
  const [locationMode, setLocationMode] = useState<LocationMode>("subway");
  const [keyword, setKeyword] = useState("삼성역, 봉은사역, 서울 강남구 테헤란로");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [jobField, setJobField] = useState("전체");
  const [weekDay, setWeekDay] = useState("전체");
  const [timeSlot, setTimeSlot] = useState("전체");
  const [workStyle, setWorkStyle] = useState("전체");
  const [careerOnly, setCareerOnly] = useState(false);
  const [quickStartOnly, setQuickStartOnly] = useState(false);
  const [remotePreferred, setRemotePreferred] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("match");

  const filteredCompanies = useMemo(() => {
    let list = [...flexibleJobCompanies];

    if (remotePreferred) {
      list = list.filter((item) => item.workStyle.includes("재택"));
    }

    if (quickStartOnly) {
      list = list.filter((item) => item.workDays.includes("월") || item.workDays.includes("주"));
    }

    if (careerOnly) {
      list = list.filter((item) => item.title.includes("경력"));
    }

    if (searchKeyword.trim()) {
      list = list.filter(
        (item) =>
          item.companyName.includes(searchKeyword) ||
          item.distance.includes(searchKeyword) ||
          item.title.includes(searchKeyword)
      );
    }

    if (sortMode === "distance") {
      list.sort((a, b) => a.rank - b.rank);
    }

    return list;
  }, [careerOnly, quickStartOnly, remotePreferred, searchKeyword, sortMode]);

  const handleSearch = () => setSearchKeyword(keyword);

  const resetFilters = () => {
    setJobField("전체");
    setWeekDay("전체");
    setTimeSlot("전체");
    setWorkStyle("전체");
    setCareerOnly(false);
    setQuickStartOnly(false);
    setRemotePreferred(false);
    setKeyword("");
    setSearchKeyword("");
  };

  return (
    <div className="wd-company-page">
      <PublicHeaderNav activePath="/flexible-jobs" memberLabel="이원서 일반 회원" navType="member" />

      <PageContainer>
        <section className="wd-flex-shell wd-ui-card">
          <div className="wd-flex-head__notice">
            <strong>
              <span className="wd-inline-icon wd-inline-icon--info" aria-hidden="true" />
              매칭 안내
            </strong>
            <p>위치 + 요일 + 시간 + 업무가 맞는 공고를 우선 보여드리고, 일부 일치 결과도 함께 추천합니다.</p>
          </div>

          <div className="wd-flex-filter wd-flex-filter--top">
            <select value={jobField} onChange={(event) => setJobField(event.target.value)}>
              <option>업무 분야 전체</option>
              <option>디자인</option>
              <option>개발</option>
              <option>기획</option>
              <option>마케팅</option>
              <option>운영</option>
              <option>영업</option>
            </select>
            <select value={weekDay} onChange={(event) => setWeekDay(event.target.value)}>
              <option>가능 요일 전체</option>
              <option>요일 협의 가능</option>
              <option>주 1~2회</option>
              <option>주 3~4회</option>
              <option>월~금</option>
            </select>
            <select value={timeSlot} onChange={(event) => setTimeSlot(event.target.value)}>
              <option>가능 시간 전체</option>
              <option>오전</option>
              <option>오후</option>
              <option>저녁</option>
            </select>
            <select value={workStyle} onChange={(event) => setWorkStyle(event.target.value)}>
              <option>근무 형태 전체</option>
              <option>부분 재택</option>
              <option>출근 근무</option>
              <option>하이브리드</option>
            </select>

            <div className="wd-flex-filter__chips">
              {quickFilters.map((filter) => {
                const selected =
                  (filter.key === "career" && careerOnly) ||
                  (filter.key === "quickStart" && quickStartOnly) ||
                  (filter.key === "remote" && remotePreferred);

                return (
                  <button
                    className={`wd-flex-filter__chip ${selected ? "is-active" : ""}`}
                    key={filter.key}
                    type="button"
                    onClick={() => {
                      if (filter.key === "career") setCareerOnly((current) => !current);
                      if (filter.key === "quickStart") setQuickStartOnly((current) => !current);
                      if (filter.key === "remote") setRemotePreferred((current) => !current);
                    }}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            <button className="wd-flex-filter__reset wd-flex-filter__reset--plain" type="button" onClick={resetFilters}>
              <span className="wd-inline-icon wd-inline-icon--refresh" aria-hidden="true" />
              필터 초기화
            </button>
          </div>

          <div className="wd-flex-search">
            <div className="wd-flex-search__bar wd-flex-search__bar--inline">
              <div className="wd-flex-search__tabs">
                <button
                  className={`wd-flex-search__tab ${locationMode === "current" ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setLocationMode("current")}
                >
                  현재 위치
                </button>
                <button
                  className={`wd-flex-search__tab ${locationMode === "subway" ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setLocationMode("subway")}
                >
                  지하철역
                </button>
                <button
                  className={`wd-flex-search__tab ${locationMode === "address" ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setLocationMode("address")}
                >
                  주소 검색
                </button>
              </div>

              <label className="wd-flex-search__input">
                <input
                  type="text"
                  value={keyword}
                  onFocus={() => setKeyword("")}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="예) 강남역, 논현역, 서울 강남구 테헤란로"
                />
              </label>
              <Button variant="secondary" onClick={() => setKeyword("내 위치 기반 강남구")}>
                내 위치 사용
              </Button>
              <Button onClick={handleSearch}>검색</Button>
            </div>
          </div>

          <div className="wd-flex-content">
            <div className="wd-flex-map wd-ui-card">
              <span className="wd-flex-map__tag">지도 기준 반경 2km</span>
              <img src={flexibleJobsMapMockup} alt="강남, 논현, 신사역 지도 미리보기" />
              <span className="wd-flex-map__marker wd-flex-map__marker--one">1</span>
              <span className="wd-flex-map__marker wd-flex-map__marker--two">2</span>
              <span className="wd-flex-map__marker wd-flex-map__marker--three">3</span>
              <span className="wd-flex-map__marker wd-flex-map__marker--four">4</span>
              <span className="wd-flex-map__my-location" aria-hidden="true">
                <span />
              </span>
              <div className="wd-flex-map__controls" aria-hidden="true">
                <button type="button">+</button>
                <button type="button">-</button>
                <button className="wd-flex-map__control-location" type="button">
                  <span className="wd-inline-icon wd-inline-icon--location-target" />
                </button>
              </div>
              <button className="wd-flex-map__current" type="button" onClick={() => setKeyword("현재 위치")}>
                현재 위치
              </button>
            </div>

            <div className="wd-flex-list">
              <div className="wd-flex-list__header">
                <h2>추천 기업 12개</h2>

                <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
                  <option value="match">매칭도순</option>
                  <option value="distance">거리순</option>
                </select>
              </div>

              <div className="wd-flex-list__notice">
                완전 매칭 기업이 없을 경우, 조건이 일부 일치하는 기업을 추천해드리고 있습니다.
              </div>

              <div className="wd-flex-company-list">
                {filteredCompanies.map((company) => (
                  <article className="wd-flex-company wd-ui-card" key={company.id}>
                    <span className="wd-flex-company__rank">{company.rank}</span>
                    <div className={`wd-flex-company__logo wd-flex-company__logo--${company.logoType ?? "text"}`}>
                      {company.logoType === "wonderdogs" ? (
                        <img src={wonderdogsLogo} alt={`${company.companyName} 로고`} />
                      ) : company.logoType === "next-runners" ? (
                        <span className="wd-flex-company__next-logo">NXR</span>
                      ) : (
                        company.logoText
                      )}
                    </div>

                    <div className="wd-flex-company__main">
                      <div className="wd-flex-company__title-row">
                        <h3>{company.companyName}</h3>
                        <span className={`wd-flex-company__badge wd-flex-company__badge--${company.badgeTone}`}>
                          {company.badge}
                        </span>
                      </div>
                      <strong>{company.title}</strong>
                      <p>{company.distance}</p>
                    </div>

                    <dl className="wd-flex-company__meta">
                      <div>
                        <dt>요일</dt>
                        <dd>{company.workDays}</dd>
                      </div>
                      <div>
                        <dt>시간</dt>
                        <dd>{company.workHours}</dd>
                      </div>
                      <div>
                        <dt>형태</dt>
                        <dd>{company.workStyle}</dd>
                      </div>
                    </dl>

                    <div className="wd-flex-company__side">
                      <span className="wd-flex-company__assignment">{company.assignment}</span>
                      <span className="wd-flex-company__time">{company.estimatedTime}</span>
                      <div className="wd-flex-company__actions">
                        <Button href="/company/job-posts" size="small" variant="secondary">
                          공고 보기
                        </Button>
                        <Button href="/login" size="small">
                          지원하기
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <Button className="wd-flex-list__more" type="button" variant="secondary">
                더 많은 기업 보기
              </Button>
            </div>
          </div>
        </section>
      </PageContainer>
    </div>
  );
}
