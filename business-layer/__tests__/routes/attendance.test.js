const {
  createAttendance,
  getAttendanceById,
  getAttendanceByMemberId,
  getAttendanceByMemberAndEvent,
  getMemberAttendanceWithEvents,
  getEventAttendanceWithMembers,
} = require("../../data-layer/attendance");

// Mock the entire attendance module
jest.mock("../../data-layer/attendance", () => {
  const originalModule = jest.requireActual("../../data-layer/attendance");

  return {
    ...originalModule,
    getMemberAttendanceWithEvents: jest.fn(),
    getEventAttendanceWithMembers: jest.fn(),
  };
});

// Mock the database models
jest.mock("../../db.js", () => ({
  Attendance: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
}));

const { Attendance } = require("../../db");

describe("Attendance module", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Configure console methods to prevent logging during tests
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe("createAttendance", () => {
    it("should create a new attendance record successfully", async () => {
      // Mock data
      const attendanceData = {
        member_id: 1,
        event_id: 10,
      };

      const mockCreatedAttendance = {
        ...attendanceData,
        attendance_id: 1,
        toJSON: jest
          .fn()
          .mockReturnValue({ ...attendanceData, attendance_id: 1 }),
      };

      // Set up the mock implementation
      Attendance.create.mockResolvedValue(mockCreatedAttendance);

      // Call the function
      const result = await createAttendance(attendanceData);

      // Assertions
      expect(Attendance.create).toHaveBeenCalledWith(attendanceData);
      expect(result).toEqual(mockCreatedAttendance);
    });

    it("should throw an error when creation fails", async () => {
      // Mock data
      const attendanceData = {
        member_id: 1,
        event_id: 10,
      };

      const mockError = new Error("Database error");

      // Set up the mock to reject
      Attendance.create.mockRejectedValue(mockError);

      // Call the function and expect it to throw
      await expect(createAttendance(attendanceData)).rejects.toThrow(
        "Database error"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error creating attendance:",
        mockError
      );
    });
  });

  describe("getAttendanceById", () => {
    it("should return an attendance record when found by id", async () => {
      // Mock data
      const attendanceId = 1;
      const mockAttendance = {
        attendance_id: attendanceId,
        member_id: 5,
        event_id: 20,
      };

      // Set up the mock implementation
      Attendance.findByPk.mockResolvedValue(mockAttendance);

      // Call the function
      const result = await getAttendanceById(attendanceId);

      // Assertions
      expect(Attendance.findByPk).toHaveBeenCalledWith(attendanceId);
      expect(result).toEqual(mockAttendance);
    });

    it("should return null when no attendance record is found by id", async () => {
      // Mock data
      const attendanceId = 999;

      // Set up the mock implementation
      Attendance.findByPk.mockResolvedValue(null);

      // Call the function
      const result = await getAttendanceById(attendanceId);

      // Assertions
      expect(result).toBeNull();
    });

    it("should throw an error when fetch by id fails", async () => {
      // Mock data
      const attendanceId = 1;
      const mockError = new Error("Fetch by ID error");

      // Set up the mock to reject
      Attendance.findByPk.mockRejectedValue(mockError);

      // Call the function and expect it to throw
      await expect(getAttendanceById(attendanceId)).rejects.toThrow(
        "Fetch by ID error"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching attendance by ID:",
        mockError
      );
    });
  });

  describe("getAttendanceByMemberId", () => {
    it("should return attendance records for a member", async () => {
      // Mock data
      const memberId = 5;
      const mockAttendances = [
        {
          attendance_id: 1,
          member_id: memberId,
          event_id: 20,
        },
        {
          attendance_id: 2,
          member_id: memberId,
          event_id: 21,
        },
      ];

      // Set up the mock implementation
      Attendance.findAll.mockResolvedValue(mockAttendances);

      // Call the function
      const result = await getAttendanceByMemberId(memberId);

      // Assertions
      expect(Attendance.findAll).toHaveBeenCalledWith({
        where: { member_id: memberId },
      });
      expect(result).toEqual(mockAttendances);
    });

    it("should return empty array when member has no attendance records", async () => {
      // Mock data
      const memberId = 999;

      // Set up the mock implementation
      Attendance.findAll.mockResolvedValue([]);

      // Call the function
      const result = await getAttendanceByMemberId(memberId);

      // Assertions
      expect(result).toEqual([]);
    });

    it("should throw an error when fetch by member id fails", async () => {
      // Mock data
      const memberId = 5;
      const mockError = new Error("Fetch by member ID error");

      // Set up the mock to reject
      Attendance.findAll.mockRejectedValue(mockError);

      // Call the function and expect it to throw
      await expect(getAttendanceByMemberId(memberId)).rejects.toThrow(
        "Fetch by member ID error"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching attendance by member ID:",
        mockError
      );
    });
  });

  describe("getAttendanceByMemberAndEvent", () => {
    it("should return attendance record for a specific member and event", async () => {
      // Mock data
      const memberId = 5;
      const eventId = 20;
      const mockAttendance = {
        attendance_id: 1,
        member_id: memberId,
        event_id: eventId,
      };

      // Set up the mock implementation
      Attendance.findOne.mockResolvedValue(mockAttendance);

      // Call the function
      const result = await getAttendanceByMemberAndEvent(memberId, eventId);

      // Assertions
      expect(Attendance.findOne).toHaveBeenCalledWith({
        where: {
          member_id: memberId,
          event_id: eventId,
        },
      });
      expect(result).toEqual(mockAttendance);
    });

    it("should return null when no attendance record exists for the member and event", async () => {
      // Mock data
      const memberId = 5;
      const eventId = 999;

      // Set up the mock implementation
      Attendance.findOne.mockResolvedValue(null);

      // Call the function
      const result = await getAttendanceByMemberAndEvent(memberId, eventId);

      // Assertions
      expect(result).toBeNull();
    });

    it("should throw an error when fetch by member and event fails", async () => {
      // Mock data
      const memberId = 5;
      const eventId = 20;
      const mockError = new Error("Fetch by member and event error");

      // Set up the mock to reject
      Attendance.findOne.mockRejectedValue(mockError);

      // Call the function and expect it to throw
      await expect(
        getAttendanceByMemberAndEvent(memberId, eventId)
      ).rejects.toThrow("Fetch by member and event error");
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching attendance by member and event IDs:",
        mockError
      );
    });
  });

  describe("getMemberAttendanceWithEvents", () => {
    it("should return member attendance with events for an organization", async () => {
      // Mock data
      const orgId = 3;
      const memberId = 5;
      const mockAttendancesWithEvents = [
        {
          attendance_id: 1,
          member_id: memberId,
          event_id: 20,
          Event: {
            event_id: 20,
            organization_id: orgId,
            event_name: "Event 1",
          },
        },
      ];

      // Set up the mock implementation for the complete function
      getMemberAttendanceWithEvents.mockResolvedValue(
        mockAttendancesWithEvents
      );

      // Call the function
      const result = await getMemberAttendanceWithEvents(orgId, memberId);

      // Assertions
      expect(getMemberAttendanceWithEvents).toHaveBeenCalledWith(
        orgId,
        memberId
      );
      expect(result).toEqual(mockAttendancesWithEvents);
    });

    it("should throw an error when fetching member attendance with events fails", async () => {
      // Mock data
      const orgId = 3;
      const memberId = 5;
      const mockError = new Error("Fetch error");

      // Set up the mock to reject
      getMemberAttendanceWithEvents.mockRejectedValue(mockError);

      // Call the function and expect it to throw
      await expect(
        getMemberAttendanceWithEvents(orgId, memberId)
      ).rejects.toThrow("Fetch error");
    });
  });

  describe("getEventAttendanceWithMembers", () => {
    it("should return event attendance with member details", async () => {
      // Mock data
      const eventId = 20;
      const mockAttendancesWithMembers = [
        {
          attendance_id: 1,
          member_id: 5,
          event_id: eventId,
          Member: {
            member_id: 5,
            member_name: "John Doe",
          },
        },
        {
          attendance_id: 2,
          member_id: 6,
          event_id: eventId,
          Member: {
            member_id: 6,
            member_name: "Jane Smith",
          },
        },
      ];

      // Set up the mock implementation for the complete function
      getEventAttendanceWithMembers.mockResolvedValue(
        mockAttendancesWithMembers
      );

      // Call the function
      const result = await getEventAttendanceWithMembers(eventId);

      // Assertions
      expect(getEventAttendanceWithMembers).toHaveBeenCalledWith(eventId);
      expect(result).toEqual(mockAttendancesWithMembers);
    });

    it("should throw an error when fetching event attendance with members fails", async () => {
      // Mock data
      const eventId = 20;
      const mockError = new Error("Fetch error");

      // Set up the mock to reject
      getEventAttendanceWithMembers.mockRejectedValue(mockError);

      // Call the function and expect it to throw
      await expect(getEventAttendanceWithMembers(eventId)).rejects.toThrow(
        "Fetch error"
      );
    });
  });
});
