import { assignmentDbMock } from "../src/mocks/assignmentDb";
import { getCompanyJobPostings, getPublicJobPostings } from "../src/mocks/jobPostings";

function uniqueById<T>(items: T[], getId: (item: T) => string) {
  return items.filter((item, index, list) => list.findIndex((candidate) => getId(candidate) === getId(item)) === index);
}

export const firestoreSeedData = {
  assignments: assignmentDbMock,
  jobPostings: uniqueById([...getPublicJobPostings(), ...getCompanyJobPostings()], (item) => item.jobPostingId)
};
