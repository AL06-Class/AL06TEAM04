# WONDERDOGs MVP 공통 기준서 v1.0
# 1. 문서 목적

이 문서는 WONDERDOGs 유연근무제 특화 채용 플랫폼 MVP 개발을 위한 **공통 이름 사전 + 스키마 + 페이지 이름 사전 + User Flow 기준서**입니다.

4명이 함께 개발할 때 아래 항목을 모두 이 문서 기준으로 통일합니다.

- 화면 이름
- 페이지명
- 라우트
- Firestore 컬렉션명
- 필드명
- 역할값
- 상태값
- 공통 값
- 공통 컴포넌트명
- 화면 간 이동 흐름
- 카드/탭/필터/버튼명
- 화면 표시 문구 기준

---

# 2. MVP 핵심 흐름

```text
메인 홈
├─ 로그인
│  ├─ 기업 로그인 시작하기
│  │  └─ 기업 대시보드
│  │     ├─ 공고 관리
│  │     │  ├─ 공고 관리
│  │     │  ├─ 새 공고 등록
│  │     │  ├─ 공고 미리보기
│  │     │  ├─ 공고 등록 완료
│  │     │  └─ 등록된 공고 보기 → 구직자용 공고 상세 화면
│  │     └─ 과제 관리
│  │        ├─ 과제 관리
│  │        └─ 새 과제 생성하기
│  │
│  └─ 일반 회원 로그인 시작하기
│     └─ 유연근무 공고 지도 검색
│        └─ 공고 상세 보기
│
└─ 유연근무 공고 버튼
   └─ 유연근무 공고 지도 검색
      └─ 공고 상세 보기
```

---

# 3. 핵심기능 정의

## 3-1. 공고 관리

기업이 유연근무 조건 중심의 공고를 편하게 등록하고 관리하는 기능입니다.

공고 등록은 4단계로 구성합니다.

```text
1단계. 회사 기본 정보
2단계. 유연근무 조건
3단계. 업무 상세
4단계. 과제
```

중요 기준:

```text
- 회사 기본 정보는 한 번 저장하면 새 공고 등록 시 자동으로 불러옵니다.
- 공고 등록 단계는 4단계로 고정합니다.
- 기본값은 미리 세팅하고, 가능한 항목은 드롭다운/칩/버튼 선택 방식으로 제공합니다.
- 공고 등록 오른쪽에는 공고 미리보기 패널을 고정으로 보여줍니다.
- 공고 등록 완료 화면에서 “등록된 공고 보기”를 누르면 구직자가 보는 공고 상세 페이지로 이동합니다.
- 등록 완료 후에도 공고는 수정 가능해야 합니다.
- 공고 등록 완료 버튼 클릭 시 공고 상태는 `posted`로 저장합니다.
- 임시 저장 버튼 클릭 시 공고 상태는 `draft`로 저장합니다.
- 공고 등록 4단계에서 과제는 선택 사항입니다.
```

## 3-2. 과제 관리

기업이 사전과제를 생성하고 관리하는 기능입니다.

중요 기준:

```text
- 과제는 공고 등록의 필수가 아닙니다.
- 과제 없는 공고도 등록할 수 있습니다.
- 과제는 공고 없이 미리 생성할 수 있습니다.
- 공고 등록 중 과제 생성 페이지로 이동할 수 있습니다.
- 과제 생성 페이지는 공고 등록에서 넘어온 경우에만 일부 정보가 자동 입력됩니다.
- 공고 없이 과제 생성 페이지로 들어온 경우에는 수동으로 작성합니다.
- 생성된 과제 후보 3개는 각각 수정, 임시저장, 재생성이 가능합니다.
- 후보별 선택 버튼을 제공합니다.
- 선택한 후보가 여러 개일 수 있으며, 선택한 후보들을 등록할 수 있습니다.
```


과제 관리 화면 추가 기준:

```text
- 사용 가능(`available`) 상태의 과제는 공고에 연결하지 않아도 지원자에게 개별 요청할 수 있습니다.
- 공고 연결됨(`linked`) 상태의 과제도 연결 공고 지원자에게 제공되는 것과 별개로 특정 지원자에게 개별 요청할 수 있습니다.
- 임시저장(`draft`) 상태의 과제는 아직 완성 전이므로 지원자에게 요청할 수 없습니다.
- 과제 카드에는 상태에 따라 “공고에 연결하기”, “연결된 공고 보기”, “계속 편집하기”, “지원자에게 과제 요청하기”, “과제 요청 불가” 버튼을 표시합니다.
- “지원자에게 과제 요청하기” 버튼을 누르면 지원자 선택 모달을 보여줍니다.
- 지원자 선택 모달에서는 지원자 목록을 보여주고, 지원자를 클릭한 뒤 “선택한 지원자에게 과제 전송” 버튼으로 요청 흐름을 완료합니다.
- 전송 완료 후에는 “과제 요청을 전송했어요.” 안내를 보여줍니다.
```

공고 등록 4단계 과제 화면 기준:

```text
상단 탭:
- 과제 연결 안 함
- 기존 과제에서 선택

기존 과제에서 선택 영역:
- 기존 과제 리스트
- 과제별 선택 버튼
- 하단 새 과제 생성하기 버튼
```

## 3-3. 유연근무 공고 지도 검색

일반 회원 또는 방문자가 실제 지도에서 유연근무 조건에 맞는 기업/공고를 찾는 기능입니다.

중요 기준:

```text
- 메인 화면 지도는 서비스 설명용 정적 이미지입니다.
- 유연근무 공고 화면 지도는 실제 지도 기능입니다.
- 검색 대상은 companies가 아니라 posted 상태의 jobPostings입니다.
- 지도 마커 기준은 jobPostings.location입니다.
- 공고 카드에는 회사 정보와 공고 정보를 함께 보여줍니다.
- 구직자가 보는 공고 상세 페이지에서는 유연근무 조건과 지도 기반 위치 정보가 돋보여야 합니다.
- 공고에 사전과제가 연결되어 있다면 공고 상세 화면에 사전과제 영역을 보여줍니다.
```

---

# 4. 페이지 / 화면 이름 사전

| 화면 ID | 화면 이름 | 개발 페이지명 | 경로 | 접근 사용자 | 설명 |
|---|---|---|---|---|---|
| P01 | 메인 홈 화면 | `MainPage` | `/` | 전체 | 서비스 소개, 유연근무 공고/경력자 찾기 CTA |
| P02 | 로그인 화면 | `LoginPage` | `/login` | 전체 | 기업 로그인, 일반 회원 로그인 분리 |
| P03 | 기업 대시보드 | `CompanyDashboardPage` | `/company` | 기업 | 공고/과제/최근 현황 진입 |
| P04 | 공고 관리 화면 | `JobPostManagePage` | `/company/job-posts` | 기업 | 등록 공고 목록, 상태 필터, 검색 |
| P05 | 공고 등록 1단계 회사 기본 정보 | `JobPostCreateCompanyInfoStep` | `/company/job-posts/new?step=company` | 기업 | 저장 회사 정보 불러오기/수정 |
| P06 | 공고 등록 2단계 유연근무 조건 | `JobPostCreateFlexibleWorkStep` | `/company/job-posts/new?step=flexible-work` | 기업 | 근무 방식, 요일, 시간, 급여, 위치 |
| P07 | 공고 등록 3단계 업무 상세 | `JobPostCreateWorkDetailStep` | `/company/job-posts/new?step=work-detail` | 기업 | 직무, 경력, 스킬, 주요 업무 |
| P08 | 공고 등록 4단계 과제 | `JobPostCreateAssignmentStep` | `/company/job-posts/new?step=assignment` | 기업 | 과제 연결 안 함 또는 기존 과제 선택 |
| P09 | 공고 미리보기 영역 | `JobPostPreviewPanel` | 공고 등록 화면 내부 | 기업 | 입력값 실시간 요약 |
| P10 | 공고 등록 완료 화면 | `JobPostCompletePage` | `/company/job-posts/:jobPostingId/complete` | 기업 | 등록 완료 요약, 상세 보기/관리 이동 |
| P11 | 과제 관리 화면 | `AssignmentManagePage` | `/company/assignments` | 기업 | 과제 카드 목록, 상태별 관리 |
| P12 | 과제 생성 화면 | `AssignmentCreatePage` | `/company/assignments/new` | 기업 | 공고 없이 과제 생성 |
| P13 | 공고 연결 과제 생성 화면 | `AssignmentCreatePage` | `/company/assignments/new?jobPostingId={jobPostingId}` | 기업 | 공고 입력값 기반 과제 생성 |
| P14 | 유연근무 공고 지도 검색 화면 | `CompanySearchPage` | `/companies/search` | 전체 | 지도 기반 공고 검색 |
| P15 | 구직자용 공고 상세 화면 | `JobPostDetailPage` | `/job-posts/:jobPostingId` | 전체 | 공고 상세, 지도, 사전과제 확인 |

---

# 5. 라우트 이름 사전

| 목적 | 경로 | 비고 |
|---|---|---|
| 메인 홈 | `/` | 전체 접근 |
| 로그인 | `/login` | 전체 접근 |
| 기업 대시보드 | `/company` | 기업 로그인 후 |
| 공고 관리 | `/company/job-posts` | 기업 전용 |
| 새 공고 등록 | `/company/job-posts/new` | 기업 전용 |
| 공고 등록 1단계 | `/company/job-posts/new?step=company` | 회사 기본 정보 |
| 공고 등록 2단계 | `/company/job-posts/new?step=flexible-work` | 유연근무 조건 |
| 공고 등록 3단계 | `/company/job-posts/new?step=work-detail` | 업무 상세 |
| 공고 등록 4단계 | `/company/job-posts/new?step=assignment` | 과제 |
| 공고 수정 | `/company/job-posts/:jobPostingId/edit` | 기업 전용 |
| 공고 미리보기 | `/company/job-posts/:jobPostingId/preview` | 기업 전용 또는 내부 패널 |
| 공고 등록 완료 | `/company/job-posts/:jobPostingId/complete` | 기업 전용 |
| 과제 관리 | `/company/assignments` | 기업 전용 |
| 새 과제 생성 | `/company/assignments/new` | 기업 전용 |
| 공고 연결 과제 생성 | `/company/assignments/new?jobPostingId={jobPostingId}` | 기업 전용 |
| 유연근무 공고 지도 검색 | `/companies/search` | 전체 접근 |
| 구직자용 공고 상세 | `/job-posts/:jobPostingId` | 전체 접근 |

---

# 6. 상단 메뉴 이름 사전

## 6-1. 기업 로그인 상태 상단 메뉴

```text
경력자 찾기 | 공고 관리 | 과제 관리 | 지원자 관리 | 유연근무 공고
```

주의:

```text
- 공고 관리는 기업이 등록한 내 공고를 관리하는 메뉴입니다.
- 과제 관리는 기업이 등록한 과제를 관리하는 메뉴입니다.
- 유연근무 공고는 게시중인 유연근무 공고를 볼 수 있는 메뉴명으로 둡니다.
```

## 6-2. 메인 또는 비로그인 상태 상단 메뉴

```text
유연근무 공고 | 경력자 찾기 | 채용 도우미 | 이용 안내 | 고객센터
```

주의:

```text
- 비로그인 상태에서는 우측 버튼을 “로그인”으로 표시합니다.
```

## 6-3. 일반 회원 로그인 상태 상단 메뉴

```text
유연근무 공고 | 이력서 관리 | 지원 현황
```

주의:

```text
- 일반 회원 로그인 상태에서는 우측 버튼을 “일반 회원”으로 표시합니다.
```

## 6-4. 우측 회원 표시값

| 화면 표시 | 개발 값 | 설명 |
|---|---|---|
| 로그인 | `login` | 비로그인 상태 CTA |
| 기업 회원 | `company_member` | 기업 로그인 상태 |
| 일반 회원 | `jobseeker_member` | 일반 회원 로그인 상태 |

기업명 표기는 아래로 통일합니다.

```text
원더독스
```

---

# 7. Firestore 컬렉션 이름 사전

| 컬렉션명 | 목적 | 주요 화면 |
|---|---|---|
| `users` | 사용자 공통 정보 | 로그인, 권한 분기 |
| `companies` | 기업 기본 정보 | 회사 기본 정보, 공고 미리보기 |
| `jobPostings` | 유연근무 채용 공고 정보 | 공고 관리, 유연근무 공고, 공고 상세 |
| `assignments` | 사전과제 정보 | 과제 관리, 과제 생성, 공고 상세 |
| `candidateProfiles` | 지원자 프로필 정보 | 이력서 관리, 지원 현황, 지원자 관리 |
| `applications` | 지원서 정보 | 지원 현황, 지원자 관리 |


---

# 8. 역할값 사전

| 화면 표시 | 개발 값 | 설명 |
|---|---|---|
| 기업 | `recruiter` | 공고 등록, 과제 등록 가능 |
| 일반 회원 | `candidate` | 유연근무 공고, 공고 보기 가능 |
| 면접관 | `interviewer` | 면접 질문, 면접 평가, 면접 일정과 연결될 수 있는 역할 |

비회원 접근 상태:

```text
- guest는 users.role 값으로 저장하지 않습니다.
- guest는 로그인하지 않은 방문자의 접근 상태를 설명하는 화면/권한 용어입니다.
- 비회원은 메인, 유연근무 공고, 공고 상세 보기까지 접근할 수 있습니다.
- 실제 사용자가 생성되는 경우 users.role은 recruiter, candidate, interviewer 중 하나만 사용합니다.
```

---

# 9. 공통 필드 사전

| 필드명 | 타입 | 설명 |
|---|---|---|
| `createdAt` | timestamp | 생성일 |
| `updatedAt` | timestamp | 수정일 |
| `recruiterId` | string | 채용담당자 userId |
| `companyId` | string | 연결된 회사 ID |
| `status` | string | 현재 상태값 |

---

# 10. 위치 공통 필드 사전

| 화면 의미 | 필드명 | 타입 |
|---|---|---|
| 기본 주소 | `address` | string |
| 도로명 주소 | `roadAddress` | string |
| 지번 주소 | `jibunAddress` | string |
| 좌표 | `location` | map 또는 null |
| 위도 | `location.lat` | number |
| 경도 | `location.lng` | number |
| 가까운 역 | `nearStations` | array |
| 대표 가까운 역 | `primaryStationName` | string |
| 역 노선 | `stationLine` | string |
| 역 도보 시간 | `stationWalkMinutes` | number |
| 시/도 | `region1Depth` | string |
| 구/군 | `region2Depth` | string |
| 동 | `region3Depth` | string |
| 내 위치 기준 거리 | `distanceFromUserKm` | number |
| 지도 반경 km | `searchRadiusKm` | number |

좌표 구조:

```js
location: {
  lat: number,
  lng: number
}
```

가까운 역 구조:

```js
nearStations: [
  {
    stationName: "삼성역",
    lineName: "2호선",
    walkMinutes: 3,
    distanceMeters: 250
  }
]
```

---

# 11. users 스키마

```text
users/{userId}
```

| 필드명 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `userId` | string | 필수 | 사용자 ID |
| `email` | string | 선택 | 이메일 |
| `role` | string | 필수 | `recruiter`, `candidate`, `interviewer` 중 하나. `guest`는 저장하지 않음 |
| `displayName` | string | 선택 | 이름 또는 담당자명 |
| `phone` | string | 선택 | 연락처 |
| `profileImageUrl` | string | 선택 | 프로필 이미지 |
| `lastLoginAt` | timestamp | 선택 | 마지막 로그인 시각 |
| `createdAt` | timestamp | 필수 | 생성일 |
| `updatedAt` | timestamp | 필수 | 수정일 |

---

# 12. companies 스키마

```text
companies/{companyId}
```

| 필드명 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `companyId` | string | 필수 | 회사 ID |
| `recruiterId` | string | 선택 | MVP에서는 mock 가능 |
| `companyName` | string | 필수 | 회사명 |
| `businessNumber` | string | 선택 | 사업자등록번호 |
| `industry` | string | 필수 | 업종 |
| `companySize` | string | 필수 | 회사 규모 |
| `address` | string | 필수 | 회사 기본 주소 |
| `roadAddress` | string | 선택 | 도로명 주소 |
| `jibunAddress` | string | 선택 | 지번 주소 |
| `location` | map 또는 null | 선택 | 회사 기본 위치 |
| `nearStations` | array | 선택 | 가까운 지하철역 |
| `primaryStationName` | string | 선택 | 대표 가까운 역 |
| `intro` | string | 필수 | 회사 소개 |
| `logoUrl` | string | 선택 | 회사 로고 |
| `websiteUrl` | string | 선택 | 대표 웹사이트 |
| `contactName` | string | 선택 | 담당자명 |
| `contactPhone` | string | 선택 | 대표 연락처 |
| `contactEmail` | string | 선택 | 담당자 이메일 |
| `createdAt` | timestamp | 필수 | 생성일 |
| `updatedAt` | timestamp | 필수 | 수정일 |

주의:

```text
유연근무 공고 지도에서는 companies.location이 아니라 jobPostings.location을 우선 사용합니다.
```

---

# 13. jobPostings 스키마

```text
jobPostings/{jobPostingId}
```

| 필드명 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `jobPostingId` | string | 필수 | 공고 ID |
| `companyId` | string | 필수 | 회사 ID |
| `recruiterId` | string | 선택 | MVP에서는 mock 가능 |
| `title` | string | 필수 | 공고 제목 |
| `industry` | string | 필수 | 회사 기본 정보에서 자동 반영 |
| `jobCategory` | string | 필수 | 직무 카테고리 |
| `jobTitle` | string | 필수 | 직무명 |
| `employmentType` | string | 선택 | 고용 형태 |
| `experienceMin` | number | 선택 | 최소 경력 |
| `experienceMax` | number | 선택 | 최대 경력 |
| `experienceLevel` | string | 필수 | 경력 수준 |
| `requiredSkills` | array | 필수 | 필수 업무 스킬 |
| `workType` | string | 필수 | 근무 방식 |
| `flexibleWorkTypes` | array | 필수 | 유연근무 유형 |
| `workDays` | array | 필수 | 근무 요일 |
| `workStartTime` | string 또는 null | 선택 | 근무 시작 시간 |
| `workEndTime` | string 또는 null | 선택 | 근무 종료 시간 |
| `coreWorkStartTime` | string 또는 null | 선택 | 핵심 근무 시작 시간 |
| `coreWorkEndTime` | string 또는 null | 선택 | 핵심 근무 종료 시간 |
| `isWorkTimeNegotiable` | boolean | 필수 | 시간 협의 가능 여부 |
| `minWorkHoursPerDay` | number | 선택 | 하루 최소 근무 시간 |
| `workDaysPerWeek` | number | 선택 | 주당 근무일 수 |
| `workHoursPerWeek` | number | 선택 | 주당 예상 근무 시간 |
| `workDurationType` | string | 필수 | 근무 기간 유형 |
| `workDurationMonths` | number 또는 null | 선택 | 근무 개월 수 |
| `expectedStartDate` | string 또는 null | 선택 | 근무 시작 예정일 |
| `isLongTermPreferred` | boolean | 선택 | 장기 근무 희망 여부 |
| `salaryType` | string | 필수 | 급여 유형 |
| `salaryMin` | number 또는 null | 선택 | 최소 급여 |
| `salaryMax` | number 또는 null | 선택 | 최대 급여 |
| `salaryUnit` | string | 선택 | 급여 단위 |
| `isSalaryNegotiable` | boolean | 필수 | 급여 협의 가능 여부 |
| `salaryText` | string | 선택 | 급여 표시 문구 |
| `hiringCount` | number 또는 null | 선택 | 모집 인원 |
| `deadlineType` | string | 선택 | 마감 유형 |
| `deadlineDate` | string 또는 null | 선택 | 마감일 |
| `locationType` | string | 필수 | 위치 유형 |
| `address` | string | 조건부 필수 | 근무지 주소 |
| `roadAddress` | string | 선택 | 도로명 주소 |
| `jibunAddress` | string | 선택 | 지번 주소 |
| `location` | map 또는 null | 조건부 필수 | 지도 좌표 |
| `nearStations` | array | 선택 | 가까운 역 |
| `primaryStationName` | string | 선택 | 대표 가까운 역 |
| `stationWalkMinutes` | number | 선택 | 역 도보 시간 |
| `region1Depth` | string | 선택 | 시/도 |
| `region2Depth` | string | 선택 | 구/군 |
| `region3Depth` | string | 선택 | 동 |
| `mainResponsibilities` | string | 필수 | 주요 업무 |
| `requirements` | string | 선택 | 자격 요건 |
| `preferred` | string | 선택 | 우대 사항 |
| `workEnvironment` | array | 선택 | 근무 환경 |
| `additionalNotice` | string | 선택 | 추가 안내사항 |
| `assignmentIds` | array | 선택 | 연결된 과제 ID 목록 |
| `hasAssignment` | boolean | 필수 | 과제 연결 여부 |
| `assignmentSummary` | map 또는 null | 선택 | 공고 상세 카드용 과제 요약 |
| `viewCount` | number | 선택 | 조회 수 |
| `status` | string | 필수 | 공고 상태 |
| `createdAt` | timestamp | 필수 | 생성일 |
| `updatedAt` | timestamp | 필수 | 수정일 |
| `postedAt` | timestamp 또는 null | 선택 | 게시일 |
| `closedAt` | timestamp 또는 null | 선택 | 마감일 |
| `externalSource` | map 또는 null | 선택 | 외부 공고 수집 출처와 검증 정보 |

외부 공고 출처 구조:

```js
externalSource: {
  provider: "Yugacrew" | "Work24" | "Wanted",
  companyName: string,
  listingUrl: string,
  applyUrl: string,
  publishedDate: string,
  checkedAt: timestamp,
  verificationStatus: "verified_active" | "secondary_only",
  conditionVerification: "primary" | "secondary" | "unverified",
  conditionEvidence: string[],
  reusePermission?: "pending" | "confirmed" | "not_required",
  reviewNotes?: string[]
}
```

외부 공고 저장 기준:

```text
- 외부에서 수집한 공고는 원더독스 검수 전까지 status = draft로 저장합니다.
- 원문 지원 페이지가 열리고 모집 상태를 확인한 경우 verificationStatus = verified_active를 사용합니다.
- 2차 출처에서만 공고 내용을 확인한 경우 verificationStatus = secondary_only를 사용합니다.
- 유연근무 조건이 기업 원문에 있으면 conditionVerification = primary, 중개 사이트 태그에만 있으면 secondary를 사용합니다.
- 원문에서도 유연근무 조건을 확인하지 못하면 conditionVerification = unverified로 저장하고 게시 대상에서 제외합니다.
- 외부 공고의 재게시·재가공 권한 확인이 필요하면 reusePermission = pending으로 저장하고, 확인 전에는 Firebase 업로드 및 posted 전환을 하지 않습니다.
- 외부 공고를 posted로 전환하기 전 마감 여부와 재게시 가능 범위를 다시 확인합니다.
```

과제 없는 공고:

```js
assignmentIds: []
hasAssignment: false
```

과제가 연결된 공고:

```js
assignmentIds: ["assignment_123"]
hasAssignment: true
```

MVP 화면에서는 공고당 과제 1개만 선택할 수 있습니다. 단, 향후 여러 과제 연결 가능성을 위해 `assignmentIds` 배열 구조는 유지합니다.

---

# 14. assignments 스키마

```text
assignments/{assignmentId}
```

| 필드명 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `assignmentId` | string | 필수 | 과제 ID |
| `companyId` | string | 필수 | 회사 ID |
| `recruiterId` | string | 선택 | MVP에서는 mock 가능 |
| `jobPostingId` | string 또는 null | 선택 | 단일 연결 공고 ID, 필요 시 사용 |
| `jobPostingIds` | array | 선택 | 연결된 공고 ID 목록 |
| `industry` | string | 선택 | 공고에서 넘어온 경우 자동 입력 |
| `jobCategory` | string | 필수 | 채용직무 |
| `jobTitle` | string | 선택 | 직무명 |
| `experienceLevel` | string | 필수 | 경력 수준 |
| `difficulty` | string | 필수 | 난이도 |
| `difficultyScore` | number | 선택 | 난이도 점수 표시용 |
| `estimatedMinutes` | number | 필수 | 예상 소요 시간 |
| `estimatedTimeText` | string | 선택 | 화면 표시용 예상 시간 |
| `requiredSkills` | array | 필수 | 필수 업무스킬 |
| `mainResponsibilities` | string | 선택 | 주요 업무 |
| `additionalRequest` | string | 선택 | 추가 요청사항 |
| `title` | string | 필수 | 과제 제목 |
| `scenario` | string | 필수 | 과제 상황 |
| `taskInstructions` | string | 필수 | 수행 지시문 |
| `submissionFormat` | string | 필수 | 제출 형식 |
| `expectedOutput` | string | 선택 | 기대 결과물 |
| `evaluationCriteria` | array | 필수 | 평가 기준 |
| `evaluationCriteriaCount` | number | 필수 | 평가 기준 개수 |
| `generatedBy` | string | 필수 | `ai` 또는 `manual` |
| `sourceType` | string | 필수 | `preset` 또는 `job_post_flow` |
| `candidateIndex` | number | 선택 | AI 후보 번호 |
| `regenerationCount` | number | 필수 | 재생성 횟수 |
| `status` | string | 필수 | 과제 상태 |
| `createdAt` | timestamp | 필수 | 생성일 |
| `updatedAt` | timestamp | 필수 | 수정일 |
| `linkedAt` | timestamp 또는 null | 선택 | 공고 연결일 |
| `lastGeneratedAt` | timestamp 또는 null | 선택 | 마지막 AI 생성 시각 |

과제 생성 후보 기준:

```text
AI가 후보 3개를 생성합니다.
각 후보는 화면에서 각각 선택, 수정, 임시저장, 재생성할 수 있습니다.
임시저장 또는 등록한 후보는 각각 assignments 문서로 저장할 수 있습니다.
```

---

# 15. 상태값 사전

## 15-1. 공고 상태값

| 화면 표시 | 개발 값 | 설명 | 노출 여부 |
|---|---|---|---|
| 임시저장 | `draft` | 작성 중 | 기업 관리에서만 노출 |
| 게시중 | `posted` | 유연근무 공고에 노출 | 전체 노출 |
| 마감 | `closed` | 마감된 공고 | 기업 관리 노출, 검색 결과 비노출 가능 |

MVP 필수 상태:

```text
draft
posted
closed
```

상태 저장 기준:

```text
- 임시 저장 버튼 클릭 시: jobPostings.status = draft, postedAt = null
- 등록 완료 버튼 클릭 시: jobPostings.status = posted, postedAt = 현재 시각
- 마감 처리 시: jobPostings.status = closed, closedAt = 현재 시각
```

## 15-2. 과제 상태값

| 화면 표시 | 개발 값 | 설명 |
|---|---|---|
| 임시저장 | `draft` | 작성 중 |
| 사용 가능 | `available` | 공고 연결 또는 지원자 개별 요청 가능 |
| 공고 연결됨 | `linked` | 특정 공고에 연결 |
| 사용 중지 | `disabled` | 더 이상 사용하지 않음 |





과제 상태별 지원자 요청 기준:

```text
- 임시저장(`draft`): 지원자에게 과제 요청 불가
- 사용 가능(`available`): 지원자에게 과제 요청 가능
- 공고 연결됨(`linked`): 지원자에게 과제 요청 가능
- 사용 중지(`disabled`): 지원자에게 과제 요청 불가
```

# 16. 공통 값 사전

## 16-1. 근무 방식값

| 화면 표시 | 개발 값 |
|---|---|
| 출근 | `onsite` |
| 재택 | `remote` |
| 하이브리드 | `hybrid` |
| 협의 가능 | `negotiable` |

## 16-2. 유연근무 유형값

| 화면 표시 | 개발 값 |
|---|---|
| 선택근무제 | `flexible_schedule` |
| 시차출퇴근제 | `staggered_hours` |
| 단시간 근무 | `part_time` |
| 주 3일 근무 | `three_days_week` |
| 주 4일 근무 | `four_days_week` |
| 재택근무 | `remote_work` |
| 하이브리드 근무 | `hybrid_work` |
| 시간 협의 가능 | `time_negotiable` |

## 16-3. 요일값

| 화면 표시 | 개발 값 |
|---|---|
| 월 | `mon` |
| 화 | `tue` |
| 수 | `wed` |
| 목 | `thu` |
| 금 | `fri` |
| 토 | `sat` |
| 일 | `sun` |

## 16-4. 근무 기간 유형값

| 화면 표시 | 개발 값 |
|---|---|
| 3개월 | `three_months` |
| 6개월 | `six_months` |
| 1년 | `one_year` |
| 기간 협의 | `negotiable` |
| 장기 근무 희망 | `long_term` |
| 상시 채용 | `always_open` |

## 16-5. 급여 유형값

| 화면 표시 | 개발 값 |
|---|---|
| 시급 | `hourly` |
| 월급 | `monthly` |
| 연봉 | `yearly` |
| 건별 | `per_project` |
| 협의 | `negotiable` |
| 회사 내규에 따름 | `company_policy` |

## 16-6. 고용 형태값

| 화면 표시 | 개발 값 |
|---|---|
| 정규직 | `full_time` |
| 계약직 | `contract` |
| 파트타임 | `part_time` |
| 프리랜서 | `freelance` |
| 인턴 | `intern` |
| 협의 | `negotiable` |

## 16-7. 경력 수준값

| 화면 표시 | 개발 값 |
|---|---|
| 신입 가능 | `entry` |
| 주니어 | `junior` |
| 미들 | `mid` |
| 시니어 | `senior` |
| 경력 무관 | `any` |

## 16-8. 과제 난이도값

| 화면 표시 | 개발 값 | 점수 표시 기준 |
|---|---|---:|
| 쉬움 | `easy` | 1~2 |
| 보통 | `normal` | 3 |
| 어려움 | `hard` | 4~5 |

## 16-9. 과제 생성 방식값

| 화면 표시 | 개발 값 |
|---|---|
| AI 생성 | `ai` |
| 직접 작성 | `manual` |

## 16-10. 과제 생성 출처값

| 화면 표시 | 개발 값 |
|---|---|
| 미리 생성 | `preset` |
| 공고 등록 중 생성 | `job_post_flow` |

## 16-11. 제출 형식값

| 화면 표시 | 개발 값 |
|---|---|
| 텍스트 답변 | `text` |
| PDF | `pdf` |
| 링크 제출 | `link` |
| 파일 제출 | `file` |
| Figma | `figma` |
| 자유 형식 | `free_format` |

## 16-12. 위치 유형값

`jobPostings.locationType`에 사용합니다.

| 화면 표시 | 개발 값 | 설명 |
|---|---|---|
| 회사 기본 주소 사용 | `company_address` | 회사 기본 정보 주소를 근무지로 사용 |
| 다른 근무지 입력 | `custom_address` | 공고별 별도 근무지 사용 |
| 재택/원격 중심 | `remote` | 고정 근무지 없이 원격 중심 |
| 위치 협의 | `negotiable` | 근무 위치를 협의로 처리 |

## 16-13. 마감 유형값

`jobPostings.deadlineType`에 사용합니다.

| 화면 표시 | 개발 값 | 설명 |
|---|---|---|
| 상시 채용 | `always_open` | 별도 마감일 없음 |
| 특정 마감일 | `specific_date` | `deadlineDate` 필수 입력 |
| 채용 시 마감 | `until_filled` | 채용 완료 시 마감 |

## 16-14. 급여 단위값

`jobPostings.salaryUnit`에 사용합니다.

| 화면 표시 | 개발 값 | 설명 |
|---|---|---|
| 원 | `krw` | 원 단위 저장 |
| 만원 | `krw_manwon` | 화면 입력 편의를 위한 만원 단위 |

## 16-15. 회사 규모값

`companies.companySize`에 사용합니다.

| 화면 표시 | 개발 값 | 설명 |
|---|---|---|
| 1~10인 | `size_1_10` | 소규모 팀 |
| 11~50인 | `size_11_50` | 초기/성장 기업 |
| 51~100인 | `size_51_100` | 중소 규모 |
| 101~300인 | `size_101_300` | 중견 규모 |
| 301인 이상 | `size_301_plus` | 대규모 조직 |

## 16-16. 근무 환경값

`jobPostings.workEnvironment`에 배열로 저장합니다.

| 화면 표시 | 개발 값 | 설명 |
|---|---|---|
| 재택 가능 | `remote_available` | 재택근무 가능 |
| 시간 협의 | `time_negotiable` | 근무 시간 조정 가능 |
| 장비 지원 | `equipment_support` | 업무 장비 지원 |
| 온보딩 제공 | `onboarding_provided` | 온보딩 또는 교육 제공 |
| 오피스 상주 | `office_resident` | 사무실 근무 중심 |

## 16-17. 위치 검색 타입값

| 화면 표시 | 개발 값 |
|---|---|
| 현재 위치 | `current_location` |
| 지하철역 | `subway_station` |
| 주소 검색 | `address` |
| 내 위치 사용 | `use_my_location` |

## 16-18. 매칭 배지값

| 화면 표시 | 개발 값 | 설명 |
|---|---|---|
| 완전 매칭 | `full_match` | 위치+요일+시간+업무 모두 일치 |
| 부분 매칭 | `partial_match` | 일부 조건 일치 |
| 요일 우선 | `day_priority` | 완전 매칭 없을 때 요일 우선 추천 |
| 시간 우선 | `time_priority` | 완전 매칭 없을 때 시간 우선 추천 |
| 업무 우선 | `job_priority` | 업무 분야 중심 추천 |

---

# 17. 공고 등록 단계별 입력 필드

## 17-1. 1단계 회사 기본 정보

저장된 회사 정보를 불러오거나 수정합니다.

필드:

```text
companyName
industry
companySize
address
nearStations
primaryStationName
intro
logoUrl
websiteUrl
contactPhone
contactEmail
```

화면 기준:

```text
- 저장된 회사 정보가 있으면 자동 표시합니다.
- “회사 정보 수정” 버튼으로 수정할 수 있습니다.
- 이 정보는 공고에 자동 반영되며 다음 공고 등록 시에도 재사용됩니다.
```

## 17-2. 2단계 유연근무 조건

기본값은 저장된 회사 정보와 추천 조건으로 미리 세팅합니다.

필드:

```text
workType
flexibleWorkTypes
workDays
workStartTime
workEndTime
coreWorkStartTime
coreWorkEndTime
isWorkTimeNegotiable
minWorkHoursPerDay
workDurationType
workDurationMonths
salaryType
salaryMin
salaryMax
salaryUnit
isSalaryNegotiable
locationType
address
nearStations
primaryStationName
stationWalkMinutes
```

화면 기준:

```text
- 근무 방식은 버튼/칩으로 선택합니다.
- 유연근무 유형은 드롭다운으로 선택합니다.
- 요일은 칩으로 다중 선택합니다.
- 시간 협의 가능은 토글로 선택합니다.
- 급여 범위는 드롭다운 또는 숫자 입력으로 선택합니다.
- 회사 기본 주소를 기반으로 근무 위치와 가까운 역을 자동 적용합니다.
```

## 17-3. 3단계 업무 상세


필수:

```text
title
industry
jobCategory
jobTitle
experienceLevel
requiredSkills
mainResponsibilities
```

선택:

```text
hiringCount
requirements
preferred
workEnvironment
additionalNotice
```

과제 생성 페이지로 자동 전달되는 필드:

```text
industry
jobCategory
jobTitle
experienceLevel
requiredSkills
mainResponsibilities
```

화면 기준:

```text
- 업종, 직무, 경력 수준, 필수 업무 스킬, 주요 업무 정보는 다음 단계 과제 생성에 활용됩니다.
- 필수 업무 스킬은 칩 형태로 입력/삭제합니다.
- 주요 업무, 자격 요건, 우대 사항은 추천 칩 + 직접 입력을 함께 지원합니다.
- 근무 환경은 카드형 토글로 선택합니다.
- 모집 인원(`hiringCount`)은 3단계 업무 상세에서 입력합니다.
```

## 17-4. 4단계 과제

상단 탭:

```text
과제 연결 안 함
기존 과제에서 선택
```

기존 과제에서 선택 영역:

```text
검색창
직무 필터
경력 수준 필터
난이도 필터
기존 과제 리스트
과제별 선택 버튼
하단 새 과제 생성하기 버튼
```

화면 기준:

```text
- 과제 연결 안 함을 선택해도 공고 등록이 가능합니다.
- MVP에서는 기존 과제를 최대 1개만 선택할 수 있습니다.
- 기존 과제를 선택하면 jobPostings.assignmentIds에 assignmentId를 배열 형태로 저장합니다.
- 하단 “새 과제 생성하기” 버튼을 누르면 /company/assignments/new?jobPostingId={jobPostingId}로 이동합니다.
```

---

# 18. 공고 관리 화면 필드 / 필터 사전

## 18-1. 공고 관리 탭

| 화면 표시 | 개발 값 | 설명 |
|---|---|---|
| 전체 | `all` | 전체 공고 |
| 게시중 | `posted` | 게시 중 공고 |
| 임시저장 | `draft` | 작성 중 공고 |
| 마감 | `closed` | 마감 공고 |

## 18-2. 공고 관리 테이블 컬럼

| 화면 표시 | 필드명 | 설명 |
|---|---|---|
| 공고명 | `title` | 공고 제목 |
| 직무 | `jobCategory`, `jobTitle` | 직무 카테고리와 직무명 |
| 근무 방식 | `workType`, `address` | 근무 방식과 지역 |
| 게시 상태 | `status` | 공고 상태 |
| 최근 수정일 | `updatedAt` | 마지막 수정일 |
| 관리 | action | 편집, 미리보기, 더보기 |

## 18-3. 공고 관리 필터

| 화면 표시 | 개발 값 | 연결 필드 |
|---|---|---|
| 전체 직무 | `job_category_all` | `jobCategory` |
| 전체 근무 방식 | `work_type_all` | `workType` |
| 최근 수정일 | `sort_recent_updated` | `updatedAt` |
| 공고명 검색 | `keyword` | `title`, `jobTitle` |

---

# 19. 과제 관리 화면 필드 / 필터 사전

## 19-1. 과제 관리 탭

| 화면 표시 | 개발 값 | 설명 |
|---|---|---|
| 전체 | `all` | 전체 과제 |
| 임시저장 | `draft` | 작성 중 과제 |
| 사용 가능 | `available` | 공고 연결 또는 지원자 개별 요청 가능 |
| 공고 연결됨 | `linked` | 공고와 연결된 과제 |

## 19-2. 과제 카드 표시 필드

| 화면 표시 | 필드명 | 설명 |
|---|---|---|
| 과제 제목 | `title` | 과제명 |
| 등록일 | `createdAt` | 생성일 |
| 저장일 | `updatedAt` | 임시저장일 |
| 직무 | `jobCategory` | 과제 직무 |
| 경력 | `experienceLevel` | 요구 경력 수준 |
| 난이도 | `difficulty`, `difficultyScore` | 쉬움/보통/어려움 및 점수 |
| 예상 소요 시간 | `estimatedMinutes` | 분 단위 저장 |
| 상태 | `status` | 과제 상태 |
| 다음 단계 | action | 공고에 연결하기, 계속 편집하기, 연결된 공고 보기 |

## 19-3. 과제 관리 버튼

| 화면 표시 | 개발 값 | 동작 |
|---|---|---|
| 새 과제 등록하기 | `create_assignment` | 과제 생성 화면 이동 |
| 공고에 연결하기 | `connect_to_job_post` | 연결할 공고 선택 또는 공고 등록 4단계 이동 |
| 연결된 공고 보기 | `view_connected_job_post` | 연결 공고 상세 또는 관리 화면 이동 |
| 계속 편집하기 | `continue_editing` | 과제 생성/수정 화면 이동 |

---



## 19-4. 과제 관리 상태별 버튼 노출 기준

| 과제 상태 | 화면 표시 버튼 | 설명 |
|---|---|---|
| 사용 가능 | 공고에 연결하기 | 공고와 연결할 수 있음 |
| 사용 가능 | 지원자에게 과제 요청하기 | 특정 지원자에게 개별 과제 요청 가능 |
| 공고 연결됨 | 연결된 공고 보기 | 연결된 공고를 확인할 수 있음 |
| 공고 연결됨 | 지원자에게 과제 요청하기 | 연결 공고 제공과 별개로 특정 지원자에게 개별 요청 가능 |
| 임시저장 | 계속 편집하기 | 과제 내용을 이어서 작성 |
| 임시저장 | 과제 요청 불가 | 작성 완료 전이므로 비활성 버튼으로 표시 |

## 19-5. 지원자 과제 요청 모달 기준

| 화면 표시 | 개발 값 | 설명 |
|---|---|---|
| 지원자 선택 | `select_applicant_for_assignment` | 과제를 보낼 지원자 선택 모달 제목 |
| 지원자 목록 | `assignment_request_applicant_list` | 과제 요청 가능한 지원자 목록 |
| 지원자 검색 | `assignment_request_applicant_search` | 지원자 이름, 직무, 위치 검색 |
| 선택한 지원자에게 과제 전송 | `send_assignment_to_selected_applicant` | 선택한 지원자에게 과제 요청 전송 |
| 취소 | `cancel_assignment_request` | 모달 닫기 |
| 과제 요청을 전송했어요. | `assignment_request_sent_toast` | 전송 완료 안내 |

지원자 과제 요청 모달 화면 기준:

```text
- 모달 왼쪽 또는 상단에는 선택한 과제 요약을 보여줍니다.
- 과제 요약에는 과제 제목, 직무, 예상 소요 시간을 표시합니다.
- 지원자 목록에는 이름, 직무, 경력, 근무 가능 위치, 근무 가능 요일/시간, 지원 상태를 표시합니다.
- 지원자를 클릭하면 선택 상태를 표시합니다.
- 지원자 미선택 상태에서 전송 버튼을 누르면 먼저 지원자를 선택하라는 안내를 보여줍니다.
- 과제 전송 완료 후 모달을 닫고 전송 완료 안내를 보여줍니다.
```

# 20. 과제 생성 화면 필드 사전

## 20-1. 과제 정보 입력 영역

| 화면 표시 | 필드명 | 타입 | 설명 |
|---|---|---|---|
| 업종 | `industry` | string | 공고에서 넘어오면 자동 입력 |
| 직무 | `jobCategory` | string | 공고에서 넘어오면 자동 입력 |
| 경력 수준 | `experienceLevel` | string | 공고에서 넘어오면 자동 입력 |
| 필수 업무 스킬 | `requiredSkills` | array | 공고에서 넘어오면 자동 입력 |
| 주요 업무 | `mainResponsibilities` | string | 공고에서 넘어오면 자동 입력 |
| 추가 요청사항 | `additionalRequest` | string | 선택 입력 |
| 난이도 | `difficulty` | string | 쉬움/보통/어려움 |
| 예상 소요 시간 | `estimatedMinutes` | number | 분 단위 |
| 제출 형식 | `submissionFormat` | string | PDF, 링크, 파일 등 |

## 20-2. 생성된 과제 후보 영역

| 화면 표시 | 필드명 | 설명 |
|---|---|---|
| 후보 번호 | `candidateIndex` | 1, 2, 3 |
| 과제 제목 | `title` | AI 생성 제목 |
| 설명 | `scenario` | 과제 상황 설명 |
| 수행 지시문 | `taskInstructions` | 수행 항목 |
| 미리보기 | action | 후보 상세 확인 |
| 수정 | action | 후보 직접 수정 |
| 임시 저장 | action | 후보 임시저장 |
| 재생성 | action | 해당 후보만 재생성 |
| 선택 | `isSelected` | 등록할 후보 선택 |

---

# 21. 유연근무 공고 지도 검색 화면 사전

## 21-1. 검색 타입

| 화면 표시 | 개발 값 | 설명 |
|---|---|---|
| 현재 위치 | `current_location` | 브라우저 위치 기반 검색 |
| 지하철역 | `subway_station` | 역명 검색 |
| 주소 검색 | `address` | 주소 검색 |
| 내 위치 사용 | `use_my_location` | 현재 위치 버튼 |

## 21-2. 필터

| 화면 표시 | 개발 값 | 연결 필드 |
|---|---|---|
| 업무 분야 | `job_category` | `jobCategory` |
| 가능 요일 | `available_days` | `workDays` |
| 가능 시간 | `available_time` | `workStartTime`, `workEndTime`, `isWorkTimeNegotiable` |
| 근무 형태 | `work_type` | `workType` |
| 경력 전체 | `experience_level` | `experienceLevel` |
| 즉시 가능 | `available_now` | `expectedStartDate` 또는 확장 필드 |
| 부분 재택 선호 | `remote_preferred` | `flexibleWorkTypes`, `workType` |

## 21-3. 지도 마커 기준

```text
- 지도 마커는 companies가 아니라 jobPostings 기준입니다.
- 같은 회사가 여러 공고를 게시하면 공고별로 마커가 생길 수 있습니다.
- 동일 좌표에 여러 공고가 있으면 클러스터링 또는 목록 묶음으로 처리합니다.
```

## 21-4. 추천 기업 카드 표시 필드

| 화면 표시 | 필드명 | 설명 |
|---|---|---|
| 순위 | `rank` | 매칭 우선순위 |
| 회사명 | `companyName` | companies에서 조인 또는 복사 |
| 공고명 | `title` | jobPostings.title |
| 경력 | `experienceLevel`, `experienceMin`, `experienceMax` | 경력 표시 |
| 위치 | `primaryStationName`, `stationWalkMinutes` | 역/도보 시간 |
| 요일 | `workDays` | 근무 가능 요일 |
| 시간 | `workStartTime`, `workEndTime` | 근무 가능 시간 |
| 근무 방식 | `workType` | 재택/출근/하이브리드 |
| 과제 여부 | `hasAssignment` | 과제 있음/과제 없음 |
| 예상 과제 시간 | `assignmentSummary.estimatedMinutes` | 과제 있을 때 표시 |
| 매칭 배지 | `matchType` | 완전 매칭/부분 매칭/요일 우선 |

## 21-5. 매칭 정렬 기준

```text
1순위: 위치 + 요일 + 시간 + 업무가 모두 맞는 공고
2순위: 위치 + 요일 + 시간 일부가 맞고 업무가 맞는 공고
3순위: 요일이 맞는 공고
4순위: 시간대가 맞는 공고
5순위: 업무 분야만 맞는 공고
```

개발용 정렬 필드:

```text
matchScore
matchType
matchedConditions
unmatchedConditions
```

---

# 22. 공고 상세 보기 화면 사전

## 22-1. 상단 요약 영역 표시 필드

| 화면 표시 | 필드명 | 설명 |
|---|---|---|
| 회사명 | `companyName` | 회사명 |
| 공고 제목 | `title` | 공고명 |
| D-day | `deadlineDate`, `deadlineType` | 마감까지 남은 일수 |
| 한 줄 소개 | `summary` | 선택 필드 또는 자동 생성 |
| 근무 방식 | `workType` | 하이브리드 등 |
| 재택 여부 | `flexibleWorkTypes` | 재택 가능 등 |
| 근무 기간 | `workDurationType` | 주 3~5일 등 |
| 시간 협의 | `isWorkTimeNegotiable` | 시간 협의 여부 |
| 경력 | `experienceLevel` | 경력 조건 |
| 고용 형태 | `employmentType` | 정규직 등 |
| 급여 | `salaryText` | 급여 표시 문구 |
| 위치 | `address`, `primaryStationName` | 근무지 |
| 지원자 예상 응답 | `expectedResponseText` | 선택 필드 |

## 22-2. 본문 섹션

| 화면 표시 | 개발 섹션명 | 연결 필드 |
|---|---|---|
| 주요 업무 | `ResponsibilitiesSection` | `mainResponsibilities` |
| 자격 요건 | `RequirementsSection` | `requirements`, `requiredSkills` |
| 우대 사항 | `PreferredSection` | `preferred` |
| 근무 환경 | `WorkEnvironmentSection` | `workEnvironment` |
| 지도 위치 | `LocationMapSection` | `location`, `nearStations` |
| 사전과제 | `AssignmentInfoPanel` | `assignmentIds`, `hasAssignment` |

## 22-3. 하단 CTA

| 화면 표시 | 개발 값 | 설명 |
|---|---|---|
| 공고 공유하기 | `share_job_post` | 공유 링크 생성 |
| 지원하기 | `apply_job_post` | 공고 상세 버튼 |
| 사전과제 보기 | `view_assignment` | 과제 상세 또는 제출 화면 이동 |

---

# 23. 공고 등록 완료 화면 사전

## 23-1. 표시 필드

| 화면 표시 | 필드명 | 설명 |
|---|---|---|
| 공고 제목 | `title` | 등록된 공고명 |
| 회사명 | `companyName` | 회사명 |
| 위치 | `primaryStationName`, `address` | 근무지 |
| 상태 | `status` | 게시중 등 |
| 등록일 | `postedAt` 또는 `createdAt` | 등록 완료 시각 |
| 경력 | `experienceLevel` | 경력 조건 |
| 고용 형태 | `employmentType` | 정규직 등 |
| 마감일 | `deadlineDate` 또는 `deadlineType` | 마감 정보 |
| 근무 형태 | `workType` | 하이브리드 등 |
| 급여 | `salaryText` | 회사 내규에 따름 등 |

## 23-2. 버튼

| 화면 표시 | 개발 값 | 이동 |
|---|---|---|
| 등록된 공고 보기 | `view_posted_job_post` | `/job-posts/:jobPostingId` |
| 공고 관리로 이동 | `go_job_post_manage` | `/company/job-posts` |
| 새 공고 등록하기 | `create_another_job_post` | `/company/job-posts/new` |
| 고객센터 | `go_customer_center` | `/support` 또는 추후 확정 |

---

# 24. 버튼 / 액션 이름 사전

| 화면 표시 | 개발 액션명 | 설명 |
|---|---|---|
| 유연근무 공고 | `go_company_search` | 유연근무 공고 화면 이동 |
| 경력자 찾기 | `go_talent_search` | 경력자 찾기 화면 이동 |
| 로그인 | `go_login` | 로그인 화면 이동 |
| 시작하기 | `start_login` | 로그인 후 역할별 이동 |
| 공고 관리로 이동 | `go_job_post_manage` | 공고 관리 이동 |
| 과제 관리로 이동 | `go_assignment_manage` | 과제 관리 이동 |
| 새 공고 등록하기 | `create_job_post` | 공고 등록 시작 |
| 임시 저장 | `save_draft` | 작성 중 상태 저장 |
| 다음 단계 | `go_next_step` | 다음 스텝 이동 |
| 이전 | `go_prev_step` | 이전 스텝 이동 |
| 공고 미리보기 | `preview_job_post` | 공고 미리보기 |
| 등록 완료 | `complete_job_post` | 공고 등록 완료 |
| 편집 | `edit` | 수정 화면 이동 |
| 미리보기 | `preview` | 미리보기 확인 |
| 더보기 | `open_more_menu` | 추가 메뉴 |
| 새 과제 생성하기 | `create_assignment` | 과제 생성 이동 |
| 과제 생성하기 | `generate_assignment` | AI 후보 생성 |
| 재생성 | `regenerate_assignment` | 후보 재생성 |
| 선택 | `select_assignment` | 과제 선택 |
| 선택한 과제 등록하기 | `register_selected_assignments` | 선택 과제 등록 |
| 공고에 연결하기 | `connect_assignment_to_job_post` | 과제-공고 연결 |
| 지원하기 | `apply_job_post` | 공고 상세 버튼 |
| 공고 공유하기 | `share_job_post` | 공유 |
| 필터 초기화 | `reset_filters` | 검색 필터 초기화 |

---



과제 요청 관련 추가 액션:

| 화면 표시 | 개발 액션명 | 설명 |
|---|---|---|
| 지원자에게 과제 요청하기 | `request_assignment_to_applicant` | 과제 요청 지원자 선택 모달 열기 |
| 선택한 지원자에게 과제 전송 | `send_assignment_to_selected_applicant` | 선택한 지원자에게 과제 요청 전송 |
| 과제 요청 불가 | `assignment_request_unavailable` | 임시저장 등 요청 불가 상태 표시 |
| 지원자 선택 | `select_applicant_for_assignment` | 과제 요청 대상 지원자 선택 |
| 과제 요청 취소 | `cancel_assignment_request` | 과제 요청 모달 닫기 |

# 25. 컴포넌트 이름 사전

## 25-1. 메인 / 로그인

| 용도 | 컴포넌트명 |
|---|---|
| 메인 페이지 | `MainPage` |
| 메인 히어로 | `MainHero` |
| 메인 지도 이미지 | `MainMapPreviewImage` |
| 메인 기능 카드 | `MainFeatureCard` |
| 로그인 페이지 | `LoginPage` |
| 기업 로그인 카드 | `CompanyLoginCard` |
| 일반 회원 로그인 카드 | `MemberLoginCard` |
| CTA 버튼 영역 | `MainCtaButtons` |
| 상단 내비게이션 | `HeaderNav` |
| 회원 드롭다운 | `MemberDropdown` |

## 25-2. 기업 대시보드

| 용도 | 컴포넌트명 |
|---|---|
| 기업 대시보드 | `CompanyDashboardPage` |
| 환영 배너 | `CompanyWelcomeBanner` |
| 기업 기능 카드 | `CompanyActionCard` |
| 공고 관리 카드 | `JobPostActionCard` |
| 과제 관리 카드 | `AssignmentActionCard` |
| 최근 등록 현황 | `RecentStatusPanel` |
| 공지 배너 | `CompanyNoticeBar` |

## 25-3. 공고 관리 / 등록

| 용도 | 컴포넌트명 |
|---|---|
| 공고 관리 페이지 | `JobPostManagePage` |
| 공고 상태 탭 | `JobPostStatusTabs` |
| 공고 목록 테이블 | `JobPostTable` |
| 공고 관리 필터 | `JobPostManageFilter` |
| 공고 등록 페이지 | `JobPostCreatePage` |
| 공고 등록 스텝퍼 | `JobPostCreateStepper` |
| 회사 기본 정보 단계 | `JobPostCreateCompanyInfoStep` |
| 유연근무 조건 단계 | `JobPostCreateFlexibleWorkStep` |
| 업무 상세 단계 | `JobPostCreateWorkDetailStep` |
| 과제 선택 단계 | `JobPostCreateAssignmentStep` |
| 공고 미리보기 패널 | `JobPostPreviewPanel` |
| 공고 등록 완료 페이지 | `JobPostCompletePage` |
| 공고 완료 요약 카드 | `JobPostCompleteSummaryCard` |

## 25-4. 과제 등록 / 관리

| 용도 | 컴포넌트명 |
|---|---|
| 과제 관리 페이지 | `AssignmentManagePage` |
| 과제 상태 탭 | `AssignmentStatusTabs` |
| 새 과제 등록 버튼 | `NewAssignmentButton` |
| 기존 과제 리스트 | `AssignmentList` |
| 기존 과제 카드 | `AssignmentCard` |
| 공고 연결 버튼 | `ConnectJobPostButton` |
| 과제 생성 페이지 | `AssignmentCreatePage` |
| 과제 정보 입력 폼 | `AssignmentPromptForm` |
| 과제 생성기 | `AssignmentGenerator` |
| 과제 후보 리스트 | `AssignmentCandidateList` |
| 과제 후보 카드 | `AssignmentCandidateCard` |
| 과제 미리보기 | `AssignmentPreview` |
| 재생성 버튼 | `RegenerateAssignmentButton` |



과제 요청 관련 컴포넌트:

| 용도 | 컴포넌트명 |
|---|---|
| 지원자 과제 요청 버튼 | `RequestAssignmentToApplicantButton` |
| 지원자 과제 요청 모달 | `AssignmentRequestApplicantModal` |
| 과제 요청 지원자 검색 | `AssignmentRequestApplicantSearch` |
| 과제 요청 지원자 리스트 | `AssignmentRequestApplicantList` |
| 과제 요청 지원자 카드 | `AssignmentRequestApplicantCard` |
| 과제 요청 선택 요약 | `AssignmentRequestSelectedSummary` |
| 과제 요청 완료 안내 | `AssignmentRequestSentToast` |

## 25-5. 유연근무 공고 / 공고 상세

| 용도 | 컴포넌트명 |
|---|---|
| 유연근무 공고 페이지 | `CompanySearchPage` |
| 실제 지도 | `CompanyMapView` |
| 위치 검색 입력 | `LocationSearchInput` |
| 위치 검색 타입 탭 | `LocationSearchTypeTabs` |
| 유연근무 필터 | `FlexibleWorkSearchFilter` |
| 공고 검색 리스트 | `JobPostSearchList` |
| 공고 카드 | `JobPostSearchCard` |
| 지도 마커 | `JobPostMapMarker` |
| 지도 팝업 | `JobPostMapPopup` |
| 매칭 안내 배너 | `MatchingGuideBanner` |
| 구직자용 공고 상세 페이지 | `JobPostDetailPage` |
| 공고 상세 헤더 | `JobPostDetailHeader` |
| 공고 상세 지도 카드 | `JobPostLocationCard` |
| 사전과제 노출 영역 | `AssignmentInfoPanel` |
| 공고 상세 하단 CTA | `JobPostDetailBottomCta` |

---

# 26. 화면 표시 문구 기준

## 26-1. 서비스 핵심 문구

```text
가까운 유연근무 채용과 실제 업무 과제로 내 역량을 보여주는 채용 플랫폼
```

## 26-2. 기업 대시보드 문구

```text
원더독스님, 환영합니다!
유연근무 채용과 실제 업무 기반 과제로 더 정확한 매칭을 경험해보세요.
```

## 26-3. 공고 등록 안내 문구

```text
저장된 회사 정보를 불러오거나 수정할 수 있습니다. 이 정보는 다음 공고 등록 시에도 재사용됩니다.
```

## 26-4. 유연근무 공고 매칭 안내 문구

```text
위치 + 요일 + 시간 + 업무가 모두 일치하는 기업을 우선 보여드립니다.
완전 매칭이 없을 경우, 조건이 일부 일치하는 결과를 순서대로 추천합니다.
```

## 26-5. 공고 등록 완료 문구

```text
공고가 등록되었습니다!
등록하신 채용 공고가 WONDERDOGs에 성공적으로 등록되었습니다.
```

---



## 26-6. 과제 관리 화면 문구

```text
등록한 과제를 관리하고, 공고 연결 또는 지원자 개별 요청에 활용하세요.
```

```text
공고에 연결하지 않아도 요청할 수 있어요
```

```text
완성된 과제는 “사용 가능” 상태로 보관됩니다. 각 과제의 “지원자에게 과제 요청하기” 버튼을 누르면 지원자 목록에서 대상을 선택해 과제를 보낼 수 있어요.
```

```text
공고에 연결하거나, 지원자에게 개별 요청할 수 있어요.
```

```text
공고 지원자에게 자동 제공하거나, 별도 지원자에게도 개별 요청할 수 있어요.
```

```text
내용을 완료하면 공고 연결 또는 지원자 개별 요청이 가능해요.
```

```text
지원자를 선택해 주세요.
```

```text
과제 요청을 전송했어요.
```

```text
새로운 과제를 등록하고 공고 연결 또는 개별 요청 준비를 시작해보세요.
```

# 27. 구현 전 충돌 방지 규칙

```text
1. 메인 지도와 유연근무 공고 지도는 다릅니다.
   - 메인 지도: 정적 이미지
   - 유연근무 공고 지도: 실제 지도 기능

2. 과제는 공고 필수값이 아닙니다.
   - 과제 없는 공고도 등록 가능

3. MVP 화면에서는 공고당 과제 1개만 선택 가능합니다.
   - 단, 확장을 위해 jobPostings.assignmentIds 배열 구조는 유지합니다.

4. 공고 등록 4단계 상단에는 “새 과제 생성하기” 탭을 두지 않습니다.
   - 새 과제 생성은 기존 과제 선택 영역 하단 버튼으로만 제공합니다.

5. 공고 상세 화면은 유연근무와 위치 정보가 돋보이게 구성합니다.

6. 공고 상세 화면에 과제가 있으면 사전과제 영역을 보여줍니다.

7. 기업 상단 메뉴는 통일합니다.
   - 경력자 찾기 / 공고 관리 / 과제 관리 / 지원자 관리 / 유연근무 공고

8. 메인/비로그인 상단 메뉴는 통일합니다.
   - 유연근무 공고 / 경력자 찾기 / 채용 도우미 / 이용 안내 / 고객센터

9. 일반 회원 로그인 상태 상단 메뉴는 통일합니다.
   - 유연근무 공고 / 이력서 관리 / 지원 현황

10. 유연근무 공고 검색 대상은 companies가 아니라 posted 상태의 jobPostings입니다.

11. 공고 등록 완료 화면의 “등록된 공고 보기”는 기업 관리용 미리보기가 아니라 구직자용 공고 상세 화면으로 이동합니다.

13. 급여와 모집 인원 위치는 아래로 확정합니다.
   - 급여: 공고 등록 2단계 유연근무 조건에 유지
   - 모집 인원: 공고 등록 3단계 업무 상세에 배치


14. 과제 관리 화면에서 `available` 상태의 과제는 공고에 연결하지 않아도 지원자에게 개별 요청할 수 있습니다.

15. 과제 관리 화면에서 `linked` 상태의 과제는 연결된 공고 보기와 지원자 개별 요청을 모두 제공할 수 있습니다.

16. 과제 관리 화면에서 `draft` 상태의 과제는 지원자에게 요청할 수 없으며 “과제 요청 불가”로 표시합니다.

17. “지원자에게 과제 요청하기”는 과제 관리 화면의 버튼/모달 흐름 기준입니다. 실제 저장 구조나 지원자 관리 화면의 세부 구현은 별도 확정 전까지 임의로 추가하지 않습니다.

```

---

# 28. data-guide 추가 내용

아래 내용은 `data-guide.md`에는 있으나 기존 `wonderdogs_mvp_common_spec_v1_0.md` 본문에는 없던 추가 항목입니다. 기존 본문과 섞지 않고 별도 목록으로만 정리합니다.

## 28-1. 데이터 운영 기준 추가

```text
- 현재 선택된 유저의 role을 기준으로 화면을 분기합니다.
- 데이터는 역할별 화면에서 필요한 정보만 필터링해서 보여줍니다.
- 필드명은 영어 camelCase를 사용합니다.
- 각 데이터에는 가능하면 id, createdAt, updatedAt을 포함합니다.
- 날짜는 문자열 또는 Firebase Timestamp 중 하나로 통일합니다.
- 상태값은 자유 텍스트가 아니라 정해진 값만 사용합니다.
- 화면별로 같은 의미의 필드를 다른 이름으로 만들지 않습니다.
- 더미 데이터는 기능 검증에 필요한 최소만 만듭니다.
- 화면만 맞추기 위한 임시 필드는 나중에 제거 여부를 표시합니다.
- Firebase 연결 전에도 더미 데이터만으로 역할별 화면을 확인할 수 있어야 합니다.
- DB 구조가 정해지기 전에는 화면 컴포넌트와 데이터 접근 코드를 분리합니다.
- Firebase 연결 코드는 한 곳에서 관리합니다.
- 화면 컴포넌트는 가능한 한 데이터 형태에만 의존하게 만듭니다.
```

## 28-2. data-guide 추가 논의 항목

```text
- 주요 데이터 종류
- 컬렉션 이름
- 유저와 역할 구조
- 문서 id 생성 방식
- 필수 필드와 선택 필드
- 날짜 저장 방식
- 상태값 목록
- 더미 데이터 위치
- 화면별 필요한 데이터
- 실제 Firebase 구조와 더미 데이터 구조를 언제 맞출지
- 공통 이름 사전에 새 이름을 추가하는 승인 기준
```

## 28-3. data-guide 추가 컬렉션 이름

| 컬렉션명 | 목적 |
|---|---|
| `candidateProfiles` | 지원자 프로필 |
| `applications` | 지원서 |
| `scheduleConversations` | 일정 조율 챗봇 대화 |
| `availabilitySlots` | 면접 가능 시간 |
| `scheduleSuggestions` | 추천 면접 시간 |
| `interviews` | 확정 또는 진행 중인 면접 |
| `interviewQuestionSets` | 면접 질문 세트 |
| `interviewQuestions` | 면접 질문 |
| `evaluations` | 면접 평가 |
| `evaluationCriteria` | 평가 기준 |

## 28-4. data-guide 추가 공통 필드 이름

| 필드명 | 설명 |
|---|---|
| `id` | 문서 또는 항목 식별자 |
| `candidateId` | 지원자 식별자 |
| `interviewerId` | 면접관 식별자 |
| `applicationId` | 지원서 식별자 |
| `interviewId` | 면접 식별자 |
| `conversationId` | 일정 조율 대화 식별자 |
| `questionSetId` | 질문 세트 식별자 |
| `description` | 설명 |
| `startedAt` | 시작 시각 |
| `endedAt` | 종료 시각 |
| `scheduledAt` | 확정 시각 |
| `source` | 생성 또는 판단 근거 |

## 28-5. 일정 조율 자동화 추가 필드

| 필드명 | 설명 |
|---|---|
| `availableStartAt` | 가능한 시작 시각 |
| `availableEndAt` | 가능한 종료 시각 |
| `preferredStartAt` | 선호 시작 시각 |
| `preferredEndAt` | 선호 종료 시각 |
| `suggestedStartAt` | 추천 시작 시각 |
| `suggestedEndAt` | 추천 종료 시각 |
| `confirmedStartAt` | 확정 시작 시각 |
| `confirmedEndAt` | 확정 종료 시각 |
| `recommendationReason` | 추천 이유 |
| `priorityScore` | 추천 우선순위 점수 |
| `message` | 챗봇 대화 메시지 |
| `senderRole` | 메시지 작성자 역할 |

## 28-6. 면접 질문 및 평가 추가 필드

| 필드명 | 설명 |
|---|---|
| `resumeSummary` | 이력서 요약 |
| `portfolioSummary` | 포트폴리오 요약 |
| `questionText` | 질문 내용 |
| `questionType` | 질문 유형 |
| `questionIntent` | 질문 의도 |
| `evaluationItem` | 평가 항목 |
| `score` | 점수 |
| `comment` | 평가 의견 |

## 28-7. data-guide 추가 역할값

| 화면 표시 | 개발 값 | 설명 |
|---|---|---|
| 면접관 | `interviewer` | 면접 질문, 면접 평가, 면접 일정과 연결될 수 있는 역할 |

## 28-8. data-guide 추가 상태값 초안

| 화면 표시 | 개발 값 | 설명 |
|---|---|---|
| 제출됨 | `submitted` | 제출 상태 |
| 대기 중 | `pending` | 대기 상태 |
| 제안됨 | `proposed` | 제안 상태 |
| 확정됨 | `confirmed` | 확정 상태 |
| 거절됨 | `declined` | 거절 상태 |
| 일정 확정 | `scheduled` | 일정이 확정된 상태 |
| 자동 생성됨 | `generated` | AI 또는 시스템으로 생성된 상태 |
| 선택됨 | `selected` | 선택된 상태 |
| 완료 | `completed` | 완료 상태 |
| 취소됨 | `cancelled` | 취소 상태 |
| 추천 상태 | `recommended` | 추천 상태 |
| 완전 매칭 | `fullMatch` | 완전 매칭 상태 |
| 부분 매칭 | `partialMatch` | 부분 매칭 상태 |
| 요일 우선 매칭 | `dayPriority` | 요일 우선 매칭 상태 |
| 과제 없음 | `noTask` | 화면 배지용 상태값 |
| 과제 있음 | `hasTask` | 화면 배지용 상태값 |

주의:

```text
- noTask, hasTask는 화면 배지용 상태값입니다.
- 실제 공고의 과제 연결 여부 저장은 hasAssignment boolean과 assignmentIds 배열을 우선 사용합니다.
```

## 28-9. candidateProfiles 데이터 모델 초안

| 필드명 | 설명 |
|---|---|
| `id` | 문서 식별자 |
| `userId` | 연결된 유저 ID |
| `email` | 이메일 |
| `phone` | 연락처 |
| `position` | 지원자 포지션 |
| `resumeSummary` | 이력서 요약 |
| `portfolioSummary` | 포트폴리오 요약 |
| `availableTimes` | 가능 시간 |
| `createdAt` | 생성 시각 |
| `updatedAt` | 수정 시각 |

## 28-10. applications 데이터 모델 초안

| 필드명 | 설명 |
|---|---|
| `id` | 문서 식별자 |
| `candidateId` | 지원자 ID |
| `jobPostingId` | 공고 ID |
| `status` | 지원 상태 |
| `interviewerId` | 면접관 ID |
| `createdAt` | 생성 시각 |
| `updatedAt` | 수정 시각 |

## 28-11. scheduleConversations 데이터 모델 초안

| 필드명 | 설명 |
|---|---|
| `id` | 문서 식별자 |
| `applicationId` | 지원서 ID |
| `candidateId` | 지원자 ID |
| `recruiterId` | 채용담당자 ID |
| `status` | 대화 상태 |
| `message` | 메시지 |
| `senderRole` | 메시지 작성자 역할 |
| `createdAt` | 생성 시각 |
| `updatedAt` | 수정 시각 |

## 28-12. availabilitySlots 데이터 모델 초안

| 필드명 | 설명 |
|---|---|
| `id` | 문서 식별자 |
| `userId` | 유저 ID |
| `applicationId` | 지원서 ID |
| `availableStartAt` | 가능한 시작 시각 |
| `availableEndAt` | 가능한 종료 시각 |
| `status` | 가능 시간 상태 |
| `createdAt` | 생성 시각 |
| `updatedAt` | 수정 시각 |

## 28-13. scheduleSuggestions 데이터 모델 초안

| 필드명 | 설명 |
|---|---|
| `id` | 문서 식별자 |
| `applicationId` | 지원서 ID |
| `suggestedStartAt` | 추천 시작 시각 |
| `suggestedEndAt` | 추천 종료 시각 |
| `recommendationReason` | 추천 이유 |
| `priorityScore` | 추천 우선순위 점수 |
| `status` | 추천 상태 |
| `createdAt` | 생성 시각 |
| `updatedAt` | 수정 시각 |

## 28-14. interviews 데이터 모델 초안

| 필드명 | 설명 |
|---|---|
| `id` | 문서 식별자 |
| `applicationId` | 지원서 ID |
| `candidateId` | 지원자 ID |
| `interviewerId` | 면접관 ID |
| `confirmedStartAt` | 확정 시작 시각 |
| `confirmedEndAt` | 확정 종료 시각 |
| `status` | 면접 상태 |
| `createdAt` | 생성 시각 |
| `updatedAt` | 수정 시각 |

## 28-15. interviewQuestionSets 데이터 모델 초안

| 필드명 | 설명 |
|---|---|
| `id` | 문서 식별자 |
| `applicationId` | 지원서 ID |
| `interviewId` | 면접 ID |
| `questions` | 질문 목록 |
| `source` | 생성 또는 판단 근거 |
| `status` | 질문 세트 상태 |
| `createdAt` | 생성 시각 |
| `updatedAt` | 수정 시각 |

## 28-16. interviewQuestions 데이터 모델 초안

| 필드명 | 설명 |
|---|---|
| `id` | 문서 식별자 |
| `questionSetId` | 질문 세트 ID |
| `questionText` | 질문 내용 |
| `questionType` | 질문 유형 |
| `questionIntent` | 질문 의도 |
| `source` | 생성 또는 판단 근거 |
| `createdAt` | 생성 시각 |
| `updatedAt` | 수정 시각 |

## 28-17. evaluationCriteria 데이터 모델 초안

| 필드명 | 설명 |
|---|---|
| `id` | 문서 식별자 |
| `jobPostingId` | 공고 ID |
| `evaluationItem` | 평가 항목 |
| `description` | 설명 |
| `createdAt` | 생성 시각 |
| `updatedAt` | 수정 시각 |

## 28-18. evaluations 데이터 모델 초안

| 필드명 | 설명 |
|---|---|
| `id` | 문서 식별자 |
| `applicationId` | 지원서 ID |
| `interviewId` | 면접 ID |
| `interviewerId` | 면접관 ID |
| `score` | 점수 |
| `status` | 평가 상태 |
| `comment` | 평가 의견 |
| `createdAt` | 생성 시각 |
| `updatedAt` | 수정 시각 |

## 28-19. data-guide 최종 결정 추가 내용

```text
- 주요 컬렉션: users, companies, jobPostings, assignments, candidateProfiles, applications를 MVP 우선 기준으로 사용합니다.
- 역할 기준: candidate, recruiter, interviewer를 사용합니다.
- 필드명 규칙: 영어 camelCase를 사용합니다.
- 날짜 저장 방식: 문자열 또는 Firebase Timestamp 중 하나로 통일합니다.
- 상태값 기준: 자유 텍스트가 아니라 정해진 값만 사용합니다.
- 더미 데이터 기준: 기능 검증에 필요한 최소만 작성합니다.
- DB 연결 기준: 화면 컴포넌트와 데이터 접근 코드를 분리하고 Firebase 연결 코드는 한 곳에서 관리합니다.
- 공통 이름 사전 기준: 새 컬렉션, 필드, 상태값, 역할 값은 구현 전에 이 문서에 먼저 추가합니다.
- MVP 이름 기준: 현재 프로젝트 기준인 recruiter, candidate, interviewer, jobPostings, candidateProfiles, applications, posted, available, linked를 사용합니다.
- 외부 공고 기준: 출처와 검증 근거를 externalSource에 보관하고 검수 전에는 draft 상태로 유지합니다.
- 외부 공고 게시 기준: 유연근무 조건이 unverified이거나 재사용 권한이 pending이면 Firebase 업로드 및 posted 전환 대상에서 제외합니다.
```

## 28-20. 변경 이력

- 2026-07-14: 외부 공고 수집 출처, 원문 확인 상태, 유연근무 조건 근거를 저장하는 `externalSource` 기준 추가
- 2026-07-15: Wanted 출처, 유연근무 미확인 상태, 외부 공고 재사용 권한 검토 기준 추가
