const { getSpecificReportOrgDataInDB, getAnnualOrgReportInDB, getSemesterOrgReportInDB } = require("../../business-logic-layer/organizationReportProcessing");

const { getOrganizationById } = require("../../data-layer/organization");

const { getMemberById } = require("../../data-layer/member");

const { getMembershipsByOrgAndSemester } = require("../../data-layer/membership");

const { getMemberAttendanceWithEvents } = require("../../data-layer/attendance");

const { getSemestersByYear, getCurrentSemester } = require("../../data-layer/semester");

const { getEventsWithAttendance } = require("../../data-layer/event");

// Mock dependencies
jest.mock("../../data-layer/organization");
jest.mock("../../data-layer/member");
jest.mock("../../data-layer/reports");
jest.mock("../../data-layer/membership");
jest.mock("../../data-layer/attendance");
jest.mock("../../data-layer/semester");
jest.mock("../../data-layer/event");

describe("Organization Reports Module", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getSpecificReportOrgDataInDB", () => {
        it("should return specific report data for a member in an organization", async () => {
            getOrganizationById.mockResolvedValue({
                organization_id: 1,
                organization_name: "Test Organization",
                organization_abbreviation: "TO"
            });

            getMemberById.mockResolvedValue({
                member_id: 5,
                member_name: "John Doe",
                member_email: "johndoe@example.com",
                member_phone_number: "123-456-7890",
                role_num: 2
            });

            getMemberAttendanceWithEvents.mockResolvedValue([
                {
                    Event: {
                        event_id: 101,
                        event_name: "General Meeting",
                        event_start: "2024-03-15T10:00:00Z"
                    },
                    check_in: "2024-03-15T10:05:00Z"
                }
            ]);

            const result = await getSpecificReportOrgDataInDB(1, 5);

            expect(result.error).toBe("No error.");
            expect(result.data).not.toBeNull();
            expect(result.data.organization_id).toBe(1);
            expect(result.data.member_data.firstName).toBe("John");
            expect(result.data.attendance_data.length).toBe(1);
        });

        it("should return an error if the organization is not found", async () => {
            getOrganizationById.mockResolvedValue(null);

            const result = await getSpecificReportOrgDataInDB(1, 5);

            expect(result.error).toBe("Organization with the given ID not found");
            expect(result.data).toBeNull();
        });

        it("should return an error if the member is not found", async () => {
            getOrganizationById.mockResolvedValue({ organization_id: 1 });
            getMemberById.mockResolvedValue(null);

            const result = await getSpecificReportOrgDataInDB(1, 5);

            expect(result.error).toBe("Member Not Found");
            expect(result.data).toBeNull();
        });
    });

    describe("getAnnualOrgReportInDB", () => {
        it("should return an annual report for an organization", async () => {
            getOrganizationById.mockResolvedValue({
                organization_id: 1,
                organization_name: "Test Org",
                organization_abbreviation: "TO"
            });

            getSemestersByYear.mockResolvedValue([
                { semester_id: 201 },
                { semester_id: 202 }
            ]);

            getMembershipsByOrgAndSemester.mockResolvedValue([
                { member_id: 1, active_member: true },
                { member_id: 2, active_member: false }
            ]);

            getEventsWithAttendance.mockResolvedValue([
                {
                    event_id: 101,
                    event_start: "2024-03-15T10:00:00Z",
                    event_type: "general_meeting",
                    Attendances: [{ member_id: 1 }, { member_id: 2 }]
                }
            ]);

            const result = await getAnnualOrgReportInDB(1);

            expect(result.error).toBe("No error.");
            expect(result.data).not.toBeNull();
            expect(result.data.organization_id).toBe(1);
            expect(result.data["meetings_data_this_year"].number_of_meetings).toBe(1);
            expect(result.data["meetings_data_this_year"].total_attendance).toBe(2);
        });

        it("should return an error if organization is not found", async () => {
            getOrganizationById.mockResolvedValue(null);

            const result = await getAnnualOrgReportInDB(1);

            expect(result.error).toBe("Organization with the given ID not found");
            expect(result.data).toBeNull();
        });
    });

    describe("getSemesterOrgReportInDB", () => {
        it("should return a semester report for an organization", async () => {
            getOrganizationById.mockResolvedValue({
                organization_id: 1,
                organization_name: "Test Org",
                organization_abbreviation: "TO"
            });

            getCurrentSemester.mockResolvedValue({
                semester_id: 201,
                semester_name: "Spring 2024",
                academic_year: 2024,
                start_date: "2024-01-01",
                end_date: "2024-05-01"
            });

            getMembershipsByOrgAndSemester.mockResolvedValue([
                { member_id: 1, active_member: true, membership_points: 10 },
                { member_id: 2, active_member: false, membership_points: 5 }
            ]);

            getEventsWithAttendance.mockResolvedValue([
                {
                    event_id: 101,
                    event_start: "2024-03-15T10:00:00Z",
                    event_type: "general_meeting",
                    Attendances: [{ member_id: 1 }]
                }
            ]);

            const result = await getSemesterOrgReportInDB(1);

            expect(result.error).toBe("No error.");
            expect(result.data).not.toBeNull();
            expect(result.data.semester).toBe("Spring 2024");
            expect(result.data.event_data.total_events).toBe(1);
            expect(result.data.event_data.total_attendance).toBe(1);
        });

        it("should return an error if organization is not found", async () => {
            getOrganizationById.mockResolvedValue(null);

            const result = await getSemesterOrgReportInDB(1);

            expect(result.error).toBe("Organization with the given ID not found");
            expect(result.data).toBeNull();
        });
    });
});
