export type Company = {
  companyId: string;
  recruiterId: string;
  companyName: string;
  industry: string;
  companySize: string;
  address: string;
  roadAddress: string;
  jibunAddress: string;
  location: {
    lat: number;
    lng: number;
  } | null;
  nearStations: Array<{
    stationName: string;
    lineName: string;
    walkMinutes: number;
    distanceMeters: number;
  }>;
  primaryStationName: string;
  intro: string;
  logoText: string;
  websiteUrl: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
};
