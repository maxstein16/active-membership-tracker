const { createAttendance, getAttendanceById, getAttendanceByMemberId, getAttendanceByMemberAndEvent, getMemberAttendanceWithEvents, getMeetingAttendanceWithMembers } = require('../../data-layer/attendance');

// Mock the entire attendance module
jest.mock('../../data-layer/attendance', () => {
  const originalModule = jest.requireActual('../../data-layer/attendance');
  
  return {
    ...originalModule,
    getMemberAttendanceWithEvents: jest.fn(),
    getMeetingAttendanceWithMembers: jest.fn()
  };
});

// Mock the database models
jest.mock('../../db.js', () => ({
  Attendance: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn()
  }
}));

const { Attendance } = require('../../db');

describe('Attendance module', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Configure console methods to prevent logging during tests
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe('createAttendance', () => {
    it('should create a new attendance record successfully', async () => {
      // Mock data
      const attendanceData = {
        member_id: 1,
        event_id: 10,
        check_in: new Date(),
        volunteer_hours: 2
      };
      
      const mockCreatedAttendance = {
        ...attendanceData,
        attendance_id: 1,
        toJSON: jest.fn().mockReturnValue({ ...attendanceData, attendance_id: 1 })
      };
      
      // Set up the mock implementation
      Attendance.create.mockResolvedValue(mockCreatedAttendance);
      
      // Call the function
      const result = await createAttendance(attendanceData);
      
      // Assertions
      expect(Attendance.create).toHaveBeenCalledWith(attendanceData);
      expect(result).toEqual(mockCreatedAttendance);
    });
  });
  
  describe('getAttendanceById', () => {
    it('should return an attendance record when found by id', async () => {
      // Mock data
      const attendanceId = 1;
      const mockAttendance = {
        attendance_id: attendanceId,
        member_id: 5,
        event_id: 20,
        check_in: new Date(),
        volunteer_hours: 3
      };
      
      // Set up the mock implementation
      Attendance.findByPk.mockResolvedValue(mockAttendance);
      
      // Call the function
      const result = await getAttendanceById(attendanceId);
      
      // Assertions
      expect(Attendance.findByPk).toHaveBeenCalledWith(attendanceId);
      expect(result).toEqual(mockAttendance);
    });
    
    it('should return null when no attendance record is found by id', async () => {
      // Mock data
      const attendanceId = 999;
      
      // Set up the mock implementation
      Attendance.findByPk.mockResolvedValue(null);
      
      // Call the function
      const result = await getAttendanceById(attendanceId);
      
      // Assertions
      expect(result).toBeNull();
    });
  });
  
  describe('getAttendanceByMemberId', () => {
    it('should return attendance records for a member', async () => {
      // Mock data
      const memberId = 5;
      const mockAttendances = [
        {
          attendance_id: 1,
          member_id: memberId,
          event_id: 20,
          check_in: new Date(),
          volunteer_hours: 2
        },
        {
          attendance_id: 2,
          member_id: memberId,
          event_id: 21,
          check_in: new Date(),
          volunteer_hours: 1
        }
      ];
      
      // Set up the mock implementation
      Attendance.findAll.mockResolvedValue(mockAttendances);
      
      // Call the function
      const result = await getAttendanceByMemberId(memberId);
      
      // Assertions
      expect(Attendance.findAll).toHaveBeenCalledWith({
        where: { member_id: memberId }
      });
      expect(result).toEqual(mockAttendances);
    });
    
    it('should return empty array when member has no attendance records', async () => {
      // Mock data
      const memberId = 999;
      
      // Set up the mock implementation
      Attendance.findAll.mockResolvedValue([]);
      
      // Call the function
      const result = await getAttendanceByMemberId(memberId);
      
      // Assertions
      expect(result).toEqual([]);
    });
  });
  
  describe('getAttendanceByMemberAndEvent', () => {
    it('should return attendance record for a specific member and event', async () => {
      // Mock data
      const memberId = 5;
      const eventId = 20;
      const mockAttendance = {
        attendance_id: 1,
        member_id: memberId,
        event_id: eventId,
        check_in: new Date(),
        volunteer_hours: 2
      };
      
      // Set up the mock implementation
      Attendance.findOne.mockResolvedValue(mockAttendance);
      
      // Call the function
      const result = await getAttendanceByMemberAndEvent(memberId, eventId);
      
      // Assertions
      expect(Attendance.findOne).toHaveBeenCalledWith({
        where: {
          member_id: memberId,
          event_id: eventId
        }
      });
      expect(result).toEqual(mockAttendance);
    });
    
    it('should return null when no attendance record exists for the member and event', async () => {
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
  });
  
  describe('getMemberAttendanceWithEvents', () => {
    it('should return member attendance with events for an organization', async () => {
      // Mock data
      const orgId = 3;
      const memberId = 5;
      const mockAttendancesWithEvents = [
        {
          attendance_id: 1,
          member_id: memberId,
          event_id: 20,
          check_in: new Date(),
          volunteer_hours: 2,
          Event: {
            event_id: 20,
            organization_id: orgId,
            event_name: 'Event 1'
          }
        }
      ];
      
      // Set up the mock implementation for the complete function
      getMemberAttendanceWithEvents.mockResolvedValue(mockAttendancesWithEvents);
      
      // Call the function
      const result = await getMemberAttendanceWithEvents(orgId, memberId);
      
      // Assertions
      expect(getMemberAttendanceWithEvents).toHaveBeenCalledWith(orgId, memberId);
      expect(result).toEqual(mockAttendancesWithEvents);
    });
  });
  
  describe('getMeetingAttendanceWithMembers', () => {
    it('should return meeting attendance with member details', async () => {
      // Mock data
      const meetingId = 20;
      const mockAttendancesWithMembers = [
        {
          attendance_id: 1,
          member_id: 5,
          event_id: meetingId,
          check_in: new Date(),
          volunteer_hours: 2,
          Member: {
            member_id: 5,
            member_name: 'John Doe'
          }
        },
        {
          attendance_id: 2,
          member_id: 6,
          event_id: meetingId,
          check_in: new Date(),
          volunteer_hours: 1,
          Member: {
            member_id: 6,
            member_name: 'Jane Smith'
          }
        }
      ];
      
      // Set up the mock implementation for the complete function
      getMeetingAttendanceWithMembers.mockResolvedValue(mockAttendancesWithMembers);
      
      // Call the function
      const result = await getMeetingAttendanceWithMembers(meetingId);
      
      // Assertions
      expect(getMeetingAttendanceWithMembers).toHaveBeenCalledWith(meetingId);
      expect(result).toEqual(mockAttendancesWithMembers);
    });
  });
});