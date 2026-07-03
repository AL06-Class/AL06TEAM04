# MVP 공통 기준

WONDERDOGs MVP를 4명이 나누어 구현할 때 화면 이름, 라우트, 이동 흐름, 버튼명, 데이터 기준을 맞추기 위한 문서입니다.

이 문서는 외부 MVP 기준서를 그대로 복사하지 않고, 현재 프로젝트 기준인 `candidate`, `recruiter`, `interviewer`, `jobPostings`, `posted`, `available`, `linked`를 우선 적용합니다.

## 핵심 흐름

```text
메인 홈
├─ 로그인
│  ├─ 채용담당자 로그인 시작
│  │  └─ 기업 대시보드
│  │     ├─ 공고 등록/관리
│  │     │  ├─ 공고 관리
│  │     │  ├─ 새 공고 등록
│  │     │  ├─ 공고 미리보기
│  │     │  ├─ 공고 등록 완료
│  │     │  └─ 등록된 공고 보기 → 지원자용 공고 상세
│  │     └─ 과제 등록/관리
│  │        ├─ 과제 관리
│  │        └─ 새 과제 생성
│  └─ 지원자 로그인 시작
│     └─ 유연근무 공고 지도 검색
│        └─ 공고 상세 보기
└─ 유연근무 공고 버튼
   └─ 유연근무 공고 지도 검색
      └─ 공고 상세 보기
```

## 역할 기준

| 화면 표시 | 개발 값 | 설명 |
| - | - | - |
| 지원자 | `candidate` | 유연근무 공고 찾기, 공고 상세 보기 가능 |
| 채용담당자 | `recruiter` | 공고 등록, 과제 등록 가능 |
| 면접관 | `interviewer` | MVP에서는 직접 화면 구현 보류 |

- 비회원은 `users.role`에 저장하지 않습니다.
- 비회원은 화면 접근 상태를 설명할 때만 `guest`라고 부를 수 있습니다.
- 비회원은 메인, 유연근무 공고 찾기, 공고 상세 보기까지 접근할 수 있습니다.

## 페이지 이름과 라우트

| 화면 ID | 화면 이름 | 개발 페이지명 | 경로 | 접근 사용자 |
| - | - | - | - | - |
| P01 | 메인 홈 | `MainPage` | `/` | 전체 |
| P02 | 로그인 | `LoginPage` | `/login` | 전체 |
| P03 | 기업 대시보드 | `CompanyDashboardPage` | `/company` | 채용담당자 |
| P04 | 공고 관리 | `JobPostManagePage` | `/company/job-posts` | 채용담당자 |
| P05 | 공고 등록 1단계 회사 기본 정보 | `JobPostCreateCompanyInfoStep` | `/company/job-posts/new?step=company` | 채용담당자 |
| P06 | 공고 등록 2단계 유연근무 조건 | `JobPostCreateFlexibleWorkStep` | `/company/job-posts/new?step=flexible-work` | 채용담당자 |
| P07 | 공고 등록 3단계 업무 상세 | `JobPostCreateWorkDetailStep` | `/company/job-posts/new?step=work-detail` | 채용담당자 |
| P08 | 공고 등록 4단계 과제 | `JobPostCreateAssignmentStep` | `/company/job-posts/new?step=assignment` | 채용담당자 |
| P09 | 공고 미리보기 영역 | `JobPostPreviewPanel` | 공고 등록 화면 내부 | 채용담당자 |
| P10 | 공고 등록 완료 | `JobPostCompletePage` | `/company/job-posts/:jobPostingId/complete` | 채용담당자 |
| P11 | 과제 관리 | `AssignmentManagePage` | `/company/assignments` | 채용담당자 |
| P12 | 과제 생성 | `AssignmentCreatePage` | `/company/assignments/new` | 채용담당자 |
| P13 | 공고 연결 과제 생성 | `AssignmentCreatePage` | `/company/assignments/new?jobPostingId={jobPostingId}` | 채용담당자 |
| P14 | 유연근무 공고 지도 검색 | `CompanySearchPage` | `/companies/search` | 전체 |
| P15 | 지원자용 공고 상세 | `JobPostDetailPage` | `/job-posts/:jobPostingId` | 전체 |

## 상단 메뉴

### 채용담당자 로그인 상태

```text
경력자 찾기 | 공고 관리 | 과제 관리 | 지원자 관리 | 유연근무 공고
```

### 메인 또는 비로그인 상태

```text
유연근무 공고 | 경력자 찾기 | 채용 도우미 | 이용 안내 | 고객센터
```

### 지원자 로그인 상태

```text
유연근무 공고 | 이력서 관리 | 지원 현황
```

## 핵심 기능 기준

### 공고 등록/관리

- 공고 등록은 4단계로 고정합니다.
- 1단계는 회사 기본 정보, 2단계는 유연근무 조건, 3단계는 업무 상세, 4단계는 과제입니다.
- 회사 기본 정보는 한 번 저장하면 새 공고 등록 시 불러올 수 있게 보입니다.
- 입력 항목은 가능한 한 드롭다운, 칩, 버튼 선택 방식으로 제공합니다.
- 공고 등록 오른쪽에는 공고 미리보기 패널을 둡니다.
- 공고 등록 완료 화면의 `등록된 공고 보기`는 채용담당자용 미리보기가 아니라 지원자용 공고 상세로 이동합니다.
- 등록 완료 시 `jobPostings.status`는 `posted`로 저장합니다.
- 임시 저장 시 `jobPostings.status`는 `draft`로 저장합니다.
- 과제는 선택 사항이며, 과제 없는 공고도 등록할 수 있습니다.

### 과제 등록/관리

- 과제는 공고 없이 미리 생성할 수 있습니다.
- 공고 등록 중 과제 생성 페이지로 이동할 수 있습니다.
- 공고 등록에서 넘어온 경우 과제 생성 입력값 일부를 자동 입력된 것처럼 보여줍니다.
- 생성된 과제 후보는 최대 3개를 기본으로 보여줍니다.
- 후보별 미리보기, 수정, 임시 저장, 재생성, 선택을 제공합니다.
- MVP 화면에서는 공고당 과제 1개만 선택합니다.
- 확장 가능성을 위해 `jobPostings.assignmentIds`는 배열 구조로 유지합니다.
- `available` 상태 과제는 공고 연결 또는 지원자 개별 요청이 가능합니다.
- `linked` 상태 과제는 연결된 공고 보기와 지원자 개별 요청을 모두 제공할 수 있습니다.
- `draft` 상태 과제는 지원자에게 요청할 수 없고 `과제 요청 불가`로 표시합니다.

### 유연근무 공고 지도 검색

- 메인 화면 지도는 서비스 설명용 정적 이미지입니다.
- 유연근무 공고 화면 지도는 실제 지도 기능입니다.
- 검색 대상은 `companies`가 아니라 `posted` 상태의 `jobPostings`입니다.
- 지도 마커 기준은 `jobPostings.location`입니다.
- 같은 회사가 여러 공고를 게시하면 공고별로 마커가 생길 수 있습니다.
- 동일 좌표에 여러 공고가 있으면 클러스터링 또는 목록 묶음으로 처리합니다.
- 공고 카드에는 회사 정보와 공고 정보를 함께 보여줍니다.

## 상태값 기준

### 공고 상태

| 화면 표시 | 개발 값 | 설명 |
| - | - | - |
| 임시저장 | `draft` | 작성 중 |
| 게시중 | `posted` | 유연근무 공고 검색과 공고 상세에 노출 |
| 마감 | `closed` | 마감된 공고 |

### 과제 상태

| 화면 표시 | 개발 값 | 설명 |
| - | - | - |
| 임시저장 | `draft` | 작성 중 과제 |
| 사용 가능 | `available` | 공고 연결 또는 지원자 개별 요청 가능 |
| 공고 연결됨 | `linked` | 특정 공고와 연결된 과제 |

### 매칭 상태

| 화면 표시 | 개발 값 | 설명 |
| - | - | - |
| 완전 매칭 | `fullMatch` | 위치, 요일, 시간, 업무가 모두 맞음 |
| 부분 매칭 | `partialMatch` | 일부 조건이 맞음 |
| 요일 우선 | `dayPriority` | 요일 조건을 우선 반영 |

## 화면 표시 문구

### 서비스 핵심 문구

```text
가까운 유연근무 채용과 실제 업무 과제로 내 역량을 보여주는 채용 플랫폼
```

### 기업 대시보드

```text
원더독스님, 환영합니다!
유연근무 채용과 실제 업무 기반 과제로 더 정확한 매칭을 경험해보세요.
```

### 공고 등록 안내

```text
저장된 회사 정보를 불러오거나 수정할 수 있습니다. 이 정보는 다음 공고 등록 시에도 재사용됩니다.
```

### 유연근무 공고 매칭 안내

```text
위치 + 요일 + 시간 + 업무가 모두 일치하는 기업을 우선 보여드립니다.
완전 매칭이 없을 경우, 조건이 일부 일치하는 결과를 순서대로 추천합니다.
```

### 공고 등록 완료

```text
공고가 등록되었습니다!
등록하신 채용 공고가 WONDERDOGs에 성공적으로 등록되었습니다.
```

### 과제 관리

```text
등록한 과제를 관리하고, 공고 연결 또는 지원자 개별 요청에 활용하세요.
```

```text
공고에 연결하지 않아도 요청할 수 있어요.
```

```text
과제 요청을 전송했어요.
```

## 버튼 / 액션 이름

| 화면 표시 | 개발 액션명 | 설명 |
| - | - | - |
| 유연근무 공고 | `goCompanySearch` | 유연근무 공고 검색 화면 이동 |
| 경력자 찾기 | `goTalentSearch` | 경력자 찾기 화면 이동 |
| 로그인 | `goLogin` | 로그인 화면 이동 |
| 시작하기 | `startLogin` | 로그인 후 역할별 이동 |
| 공고 관리로 이동 | `goJobPostManage` | 공고 관리 이동 |
| 과제 관리로 이동 | `goAssignmentManage` | 과제 관리 이동 |
| 새 공고 등록하기 | `createJobPosting` | 공고 등록 시작 |
| 임시 저장 | `saveDraft` | 작성 중 상태 저장 |
| 다음 단계 | `goNextStep` | 다음 단계 이동 |
| 이전 | `goPrevStep` | 이전 단계 이동 |
| 공고 미리보기 | `previewJobPosting` | 공고 미리보기 |
| 등록 완료 | `completeJobPosting` | 공고 등록 완료 |
| 편집 | `edit` | 수정 화면 이동 |
| 미리보기 | `preview` | 미리보기 확인 |
| 더보기 | `openMoreMenu` | 추가 메뉴 |
| 새 과제 생성하기 | `createAssignment` | 과제 생성 이동 |
| 과제 생성하기 | `generateAssignment` | AI 후보 생성 |
| 재생성 | `regenerateAssignment` | 후보 재생성 |
| 선택 | `selectAssignment` | 과제 선택 |
| 선택한 과제 등록하기 | `registerSelectedAssignments` | 선택 과제 등록 |
| 공고에 연결하기 | `connectAssignmentToJobPosting` | 과제와 공고 연결 |
| 지원자에게 과제 요청하기 | `requestAssignmentToCandidate` | 과제 요청 모달 열기 |
| 선택한 지원자에게 과제 전송 | `sendAssignmentToSelectedCandidate` | 과제 요청 전송 |
| 과제 요청 불가 | `assignmentRequestUnavailable` | 요청 불가 상태 표시 |
| 지원하기 | `applyJobPosting` | 공고 상세 지원 버튼 |
| 공고 공유하기 | `shareJobPosting` | 공유 |
| 필터 초기화 | `resetFilters` | 검색 필터 초기화 |

## 구현 전 충돌 방지 규칙

1. 메인 지도와 유연근무 공고 지도는 다릅니다.
2. 과제는 공고 필수값이 아닙니다.
3. MVP 화면에서는 공고당 과제 1개만 선택합니다.
4. 공고 등록 4단계 상단에는 `새 과제 생성하기` 탭을 두지 않습니다.
5. 공고 상세 화면은 유연근무와 위치 정보가 먼저 보이게 구성합니다.
6. 유연근무 공고 검색 대상은 `companies`가 아니라 `posted` 상태의 `jobPostings`입니다.
7. 공고 등록 완료 화면의 `등록된 공고 보기`는 지원자용 공고 상세로 이동합니다.
8. 급여는 공고 등록 2단계 유연근무 조건에 둡니다.
9. 모집 인원은 공고 등록 3단계 업무 상세에 둡니다.
10. 실제 과제 요청 저장 구조나 지원자 관리 화면 세부 구현은 별도 확정 전까지 임의로 추가하지 않습니다.

## 최종 결정

- MVP 기준은 현재 프로젝트 이름 사전을 사용합니다.
- 역할값은 `candidate`, `recruiter`, `interviewer`를 유지합니다.
- 공고 컬렉션은 `jobPostings`를 사용합니다.
- 공고 게시 상태는 `posted`를 사용합니다.
- 과제 상태는 `available`, `linked`를 사용합니다.
- 화면 라우트는 짧은 URL을 위해 `/job-posts`를 사용하고, 데이터 컬렉션은 `jobPostings`를 사용합니다.

## 변경 이력

- 2026-07-03: MVP 공통 기준서를 현재 프로젝트 이름 사전에 맞춰 작성
