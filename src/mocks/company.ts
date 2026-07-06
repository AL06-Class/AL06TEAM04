import type { Company } from "../types/company";

export const companyMock: Company = {
  companyId: "company_wonderdogs",
  recruiterId: "recruiter_hyo",
  companyName: "원더독스",
  industry: "채용 플랫폼",
  companySize: "51-200명",
  address: "서울 강남구 테헤란로 123",
  roadAddress: "서울 강남구 테헤란로 123",
  jibunAddress: "서울 강남구 역삼동 123-45",
  location: {
    lat: 37.498095,
    lng: 127.02761
  },
  nearStations: [
    {
      stationName: "강남역",
      lineName: "2호선",
      walkMinutes: 7,
      distanceMeters: 420
    }
  ],
  primaryStationName: "강남역",
  intro: "유연근무 채용과 실제 업무 기반 과제로 더 정확한 매칭을 돕는 플랫폼입니다.",
  logoText: "WD",
  websiteUrl: "https://wonderdogs.example.com",
  contactName: "원더독스 채용팀",
  contactPhone: "02-1234-5678",
  contactEmail: "recruit@wonderdogs.example.com",
  createdAt: "2026-06-01T09:00:00+09:00",
  updatedAt: "2026-07-06T09:00:00+09:00"
};
