# 공고 DB Firebase 업로드 전 검토

검토일: 2026-07-15

## 검토 범위

- 현재 작업 트리의 외부 수집 공고 10건
- `origin/student/eunji/postdb` 브랜치의 Wanted 공고 10건
- Firebase에는 쓰지 않고, 공개 화면에서 사용하지 않는 `jobPostingsFirebaseReview` 전용 데이터로만 병합 검토
- 실제 검토 데이터는 `src/mocks/jobPostingsFirebaseReview.ts`와 `src/mocks/wantedJobPostingsReview.ts`에 분리 보관

## 병합 결과

| 항목 | 결과 |
|---|---:|
| 전체 공고 | 20건 |
| 중복 ID·출처 URL | 0건 |
| 원문에서 유연근무 확인 | 7건 |
| 중개 사이트에서만 유연근무 확인 | 5건 |
| 원문에서 유연근무 미확인 | 8건 |
| Firebase 즉시 업로드 가능 | 0건 |

20건 모두 `draft`, `assignmentIds = []`, `hasAssignment = false`, `reusePermission = pending`으로 정리했습니다.
공개 화면용 `jobPostingsMock` 6건은 기존 상태로 유지해 권한 확인 전 외부 공고가 서비스에 노출되지 않도록 분리했습니다.

## 원격 브랜치 Wanted 공고 검토

| 공고 | 원문 상태 | 유연근무 근거 | 처리 |
|---|---|---|---|
| [스마트푸드네트웍스 375119](https://www.wanted.co.kr/wd/375119) | 모집 중 | 시차출퇴근제 | 검토 후보 |
| [월더 375089](https://www.wanted.co.kr/wd/375089) | 모집 중 | 미확인 | 게시 제외 |
| [모멘티 375085](https://www.wanted.co.kr/wd/375085) | 모집 중, 7월 26일 마감 | 미확인 | 게시 제외 |
| [클래스101 375081](https://www.wanted.co.kr/wd/375081) | 모집 중 | 미확인 | 게시 제외 |
| [토스뱅크 375078](https://www.wanted.co.kr/wd/375078) | 모집 중 | 자율 출퇴근·재택근무 | 검토 후보 |
| [데일리샷 375037](https://www.wanted.co.kr/wd/375037) | 모집 중 | 미확인 | 게시 제외 |
| [패스트파이브 375026](https://www.wanted.co.kr/wd/375026) | 모집 중 | 미확인 | 게시 제외 |
| [루닛 375023](https://www.wanted.co.kr/wd/375023) | 모집 중 | 미확인 | 게시 제외 |
| [데이원컴퍼니 375016](https://www.wanted.co.kr/wd/375016) | 모집 중 | 주 5일 10:00~19:00 출근 | 게시 제외 |
| [비전앤코 375008](https://www.wanted.co.kr/wd/375008) | 모집 중, 8월 12일 마감 | 미확인 | 게시 제외 |

원격 브랜치의 `주 3일·주 4일`, 임의 근무요일, 코어타임, 삼성역 중심 주소·좌표, 지원자 수, 원문에 없는 과제 연결은 원문과 일치하지 않아 제거했습니다. 실제 원문 주소와 경력 범위만 반영했고, 좌표와 상세 업무·기술 스택은 확인 전까지 비워 두었습니다.

Wanted 원문 10건 모두 페이지 하단에 무단전재·재배포·재가공 제한 고지가 있어 재사용 권한 확인 전 Firebase 업로드와 서비스 게시를 보류합니다.

## 기존 수집 공고 검토

| 분류 | 공고 | 후속 확인 |
|---|---|---|
| 원문 근거 | 아레나코리아, 엠 매니지먼트, 스캐터랩, 케이지아인터내셔널, 서울플래닝 | 마감 상태와 재사용 권한 확인 |
| 2차 출처 근거 | 커넥트웨이브, 투믹스, 요기요, 코인원, 더아이앤오 | 기업 원문에서 유연근무 조건 확인 |

엠 매니지먼트 공고는 검토일인 2026-07-15 마감 예정이므로 다음 검수 때 모집 상태를 먼저 확인해야 합니다.

## Firebase 업로드 전 통과 조건

1. 재사용 권한을 확인해 `reusePermission = confirmed`로 변경합니다.
2. `conditionVerification = secondary` 또는 `unverified`인 공고는 기업 원문 근거를 확보하거나 제외합니다.
3. 마감일, 지원 URL, 근무 형태를 업로드 당일 다시 확인합니다.
4. 주소 좌표와 필수 상세 필드를 채운 뒤 중복 ID·URL을 재검사합니다.
5. Firestore Authentication과 Security Rules가 확정된 일괄 등록 경로만 사용합니다.
6. 검토 데이터의 ISO 날짜 문자열은 업로드 경계에서 Firebase Timestamp로 변환합니다.

원격 브랜치의 공개 REST 쓰기 코드는 인증과 Security Rules 기준이 확정되지 않아 병합하지 않았습니다.
