export type JobPostingStatus = "posted" | "draft" | "closed";

export type ExternalJobSource = {
  provider: "Yugacrew" | "Work24" | "Wanted";
  companyName: string;
  listingUrl: string;
  applyUrl: string;
  publishedDate: string;
  checkedAt: string;
  verificationStatus: "verified_active" | "secondary_only";
  conditionVerification: "primary" | "secondary" | "unverified";
  conditionEvidence: string[];
  reusePermission: "pending" | "confirmed" | "not_required";
  reviewNotes?: string[];
};

export type JobPosting = {
  jobPostingId: string;
  companyId: string;
  recruiterId: string;
  title: string;
  industry: string;
  jobCategory: string;
  jobTitle: string;
  employmentType: string;
  experienceLevel: string;
  experienceMin: number | null;
  experienceMax: number | null;
  requiredSkills: string[];
  workType: string;
  flexibleWorkTypes: string[];
  workDays: string[];
  salaryType: string;
  salaryText: string;
  locationType: string;
  address: string;
  roadAddress: string;
  jibunAddress: string;
  location: {
    lat: number;
    lng: number;
  } | null;
  primaryStationName: string;
  mainResponsibilities: string;
  assignmentIds: string[];
  hasAssignment: boolean;
  status: JobPostingStatus;
  createdAt: string;
  updatedAt: string;
  postedAt: string | null;
  closedAt: string | null;
  isRecommended?: boolean;
  applicantCount?: number;
  externalSource?: ExternalJobSource;
};
