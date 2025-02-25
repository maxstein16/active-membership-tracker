const { createEvent, updateEvent, getAllEvents, getEventById, getAttendanceByEventId, getEventsByAttributes, getEventsWithAttendance } = require('../../data-layer/event');
  
  // Mock the database models
  jest.mock('../../db', () => ({
    Event: {
      create: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn()
    },
    Attendance: {
      findAll: jest.fn()
    }
  }));
  
  const { Event, Attendance } = require('../../db');
  
  describe('Event module', () => {
    beforeEach(() => {
      // Clear all mocks before each test
      jest.clearAllMocks();
      
      // Configure console methods to prevent logging during tests
      console.log = jest.fn();
      console.error = jest.fn();
    });
  
    describe('createEvent', () => {
      it('should create a new event successfully', async () => {
        // Mock data
        const eventData = {
          organization_id: 1,
          event_name: 'Tech Workshop',
          event_start: new Date('2023-10-10T10:00:00'),
          event_end: new Date('2023-10-10T12:00:00'),
          event_location: 'Room 101',
          event_description: 'Learn about new technologies',
          event_type: 'workshop'
        };
        
        const mockCreatedEvent = {
          ...eventData,
          event_id: 1,
          toJSON: jest.fn().mockReturnValue({ ...eventData, event_id: 1 })
        };
        
        // Set up the mock implementation
        Event.create.mockResolvedValue(mockCreatedEvent);
        
        // Call the function
        const result = await createEvent(eventData);
        
        // Assertions
        expect(Event.create).toHaveBeenCalledWith(eventData);
        expect(result).toEqual(mockCreatedEvent);
        expect(console.log).toHaveBeenCalledWith('Event created:', mockCreatedEvent.toJSON());
      });
      
      it('should throw an error when creation fails', async () => {
        // Mock data
        const eventData = {
          organization_id: 1,
          event_name: 'Failed Event'
        };
        
        const mockError = new Error('Database error');
        
        // Set up the mock to reject
        Event.create.mockRejectedValue(mockError);
        
        // Call the function and expect it to throw
        await expect(createEvent(eventData)).rejects.toThrow('Database error');
        expect(console.error).toHaveBeenCalledWith('Error creating event:', mockError);
      });
    });
    
    describe('updateEvent', () => {
      it('should update an event successfully', async () => {
        // Mock data
        const eventId = 1;
        const updateData = {
          event_name: 'Updated Workshop',
          event_description: 'Updated description'
        };
        
        // Set up the mock implementation
        Event.update.mockResolvedValue([1]); // means 1 row was updated
        
        // Call the function
        const result = await updateEvent(eventId, updateData);
        
        // Assertions
        expect(Event.update).toHaveBeenCalledWith(updateData, {
          where: { event_id: eventId }
        });
        expect(result).toBe(true);
        expect(console.log).toHaveBeenCalledWith(`Event with ID ${eventId} updated successfully.`);
      });
      
      it('should return false when no event is found to update', async () => {
        // Mock data
        const eventId = 999;
        const updateData = {
          event_name: 'Non-existent Event'
        };
        
        // Set up the mock implementation
        Event.update.mockResolvedValue([0]); // means 0 rows were updated
        
        // Call the function
        const result = await updateEvent(eventId, updateData);
        
        // Assertions
        expect(result).toBe(false);
        expect(console.log).toHaveBeenCalledWith(`No event found with ID ${eventId}.`);
      });
      
      it('should throw an error when update fails', async () => {
        // Mock data
        const eventId = 1;
        const updateData = {
          event_name: 'Error Test'
        };
        
        const mockError = new Error('Update error');
        
        // Set up the mock to reject
        Event.update.mockRejectedValue(mockError);
        
        // Call the function and expect it to throw
        await expect(updateEvent(eventId, updateData)).rejects.toThrow('Update error');
        expect(console.error).toHaveBeenCalledWith('Error updating event:', mockError);
      });
    });
    
    describe('getAllEvents', () => {
      it('should return all events', async () => {
        // Mock data
        const mockEvents = [
          {
            event_id: 1,
            event_name: 'Workshop 1',
            organization_id: 1,
            toJSON: jest.fn().mockReturnValue({ event_id: 1, event_name: 'Workshop 1', organization_id: 1 })
          },
          {
            event_id: 2,
            event_name: 'Workshop 2',
            organization_id: 1,
            toJSON: jest.fn().mockReturnValue({ event_id: 2, event_name: 'Workshop 2', organization_id: 1 })
          }
        ];
        
        // Set up the mock implementation
        Event.findAll.mockResolvedValue(mockEvents);
        
        // Call the function
        const result = await getAllEvents();
        
        // Assertions
        expect(Event.findAll).toHaveBeenCalled();
        expect(result).toEqual(mockEvents);
        expect(console.log).toHaveBeenCalledWith('Events found:', mockEvents.map(e => e.toJSON()));
      });
      
      it('should return an empty array when no events exist', async () => {
        // Set up the mock implementation
        Event.findAll.mockResolvedValue([]);
        
        // Call the function
        const result = await getAllEvents();
        
        // Assertions
        expect(result).toEqual([]);
        expect(console.log).toHaveBeenCalledWith('No events found in the database.');
      });
      
      it('should throw an error when fetch fails', async () => {
        const mockError = new Error('Fetch error');
        
        // Set up the mock to reject
        Event.findAll.mockRejectedValue(mockError);
        
        // Call the function and expect it to throw
        await expect(getAllEvents()).rejects.toThrow('Fetch error');
        expect(console.error).toHaveBeenCalledWith('Error fetching events:', mockError);
      });
    });
    
    describe('getEventById', () => {
      it('should return an event when found by id', async () => {
        // Mock data
        const eventId = 1;
        const orgId = 1;
        const mockEvent = {
          event_id: eventId,
          event_name: 'Test Event',
          organization_id: orgId,
          toJSON: jest.fn().mockReturnValue({ event_id: eventId, event_name: 'Test Event', organization_id: orgId })
        };
        
        // Set up the mock implementation
        Event.findOne.mockResolvedValue(mockEvent);
        
        // Call the function
        const result = await getEventById(eventId, orgId);
        
        // Assertions
        expect(Event.findOne).toHaveBeenCalledWith({
          where: { event_id: eventId, organization_id: orgId }
        });
        expect(result).toEqual(mockEvent);
        expect(console.log).toHaveBeenCalledWith('Event found:', mockEvent.toJSON());
      });
      
      it('should return null when no event is found by id', async () => {
        // Mock data
        const eventId = 999;
        const orgId = 1;
        
        // Set up the mock implementation
        Event.findOne.mockResolvedValue(null);
        
        // Call the function
        const result = await getEventById(eventId, orgId);
        
        // Assertions
        expect(result).toBeNull();
        expect(console.log).toHaveBeenCalledWith(`No event found with ID ${eventId}`);
      });
      
      it('should handle the case when orgId is not provided', async () => {
        // Mock data
        const eventId = 1;
        const mockEvent = {
          event_id: eventId,
          event_name: 'Test Event',
          organization_id: 1,
          toJSON: jest.fn().mockReturnValue({ event_id: eventId, event_name: 'Test Event', organization_id: 1 })
        };
        
        // Set up the mock implementation
        Event.findOne.mockResolvedValue(mockEvent);
        
        // Call the function without orgId
        const result = await getEventById(eventId);
        
        // Assertions
        expect(Event.findOne).toHaveBeenCalledWith({
          where: { event_id: eventId }
        });
        expect(result).toEqual(mockEvent);
      });
      
      it('should throw an error when fetch by id fails', async () => {
        // Mock data
        const eventId = 1;
        const mockError = new Error('Fetch by ID error');
        
        // Set up the mock to reject
        Event.findOne.mockRejectedValue(mockError);
        
        // Call the function and expect it to throw
        await expect(getEventById(eventId)).rejects.toThrow('Fetch by ID error');
        expect(console.error).toHaveBeenCalledWith('Error fetching event by ID:', mockError);
      });
    });
    
    describe('getAttendanceByEventId', () => {
      it('should return attendance records for an event', async () => {
        // Mock data
        const eventId = 1;
        const mockAttendances = [
          {
            attendance_id: 1,
            member_id: 10,
            event_id: eventId,
            check_in: new Date()
          },
          {
            attendance_id: 2,
            member_id: 11,
            event_id: eventId,
            check_in: new Date()
          }
        ];
        
        // Set up the mock implementation
        Attendance.findAll.mockResolvedValue(mockAttendances);
        
        // Call the function
        const result = await getAttendanceByEventId(eventId);
        
        // Assertions
        expect(Attendance.findAll).toHaveBeenCalledWith({
          where: { event_id: eventId }
        });
        expect(result).toEqual(mockAttendances);
      });
      
      it('should return empty array when event has no attendance records', async () => {
        // Mock data
        const eventId = 999;
        
        // Set up the mock implementation
        Attendance.findAll.mockResolvedValue([]);
        
        // Call the function
        const result = await getAttendanceByEventId(eventId);
        
        // Assertions
        expect(result).toEqual([]);
      });
      
      it('should throw an error when fetch by event id fails', async () => {
        // Mock data
        const eventId = 1;
        const mockError = new Error('Fetch by event ID error');
        
        // Set up the mock to reject
        Attendance.findAll.mockRejectedValue(mockError);
        
        // Call the function and expect it to throw
        await expect(getAttendanceByEventId(eventId)).rejects.toThrow('Fetch by event ID error');
        expect(console.error).toHaveBeenCalledWith('Error fetching attendance by event ID:', mockError);
      });
    });
    
    describe('getEventsByAttributes', () => {
      it('should return events matching the given attributes', async () => {
        // Mock data
        const filters = { organization_id: 1, event_type: 'workshop' };
        const mockEvents = [
          {
            event_id: 1,
            event_name: 'Workshop 1',
            organization_id: 1,
            event_type: 'workshop',
            toJSON: jest.fn().mockReturnValue({ 
              event_id: 1, 
              event_name: 'Workshop 1', 
              organization_id: 1,
              event_type: 'workshop'
            })
          }
        ];
        
        // Set up the mock implementation
        Event.findAll.mockResolvedValue(mockEvents);
        
        // Call the function
        const result = await getEventsByAttributes(filters);
        
        // Assertions
        expect(Event.findAll).toHaveBeenCalledWith({ where: filters });
        expect(result).toEqual(mockEvents);
        expect(console.log).toHaveBeenCalledWith('Events found:', mockEvents.map(e => e.toJSON()));
      });
      
      it('should return an empty array when no events match the attributes', async () => {
        // Mock data
        const filters = { organization_id: 999 };
        
        // Set up the mock implementation
        Event.findAll.mockResolvedValue([]);
        
        // Call the function
        const result = await getEventsByAttributes(filters);
        
        // Assertions
        expect(result).toEqual([]);
        expect(console.log).toHaveBeenCalledWith('No events found matching the given criteria.');
      });
      
      it('should throw an error when fetch by attributes fails', async () => {
        // Mock data
        const filters = { organization_id: 1 };
        const mockError = new Error('Fetch by attributes error');
        
        // Set up the mock to reject
        Event.findAll.mockRejectedValue(mockError);
        
        // Call the function and expect it to throw
        await expect(getEventsByAttributes(filters)).rejects.toThrow('Fetch by attributes error');
        expect(console.error).toHaveBeenCalledWith('Error fetching events by attributes:', mockError);
      });
    });
    
    describe('getEventsWithAttendance', () => {
      it('should return events with attendance records for an organization', async () => {
        // Mock data
        const orgId = 1;
        const mockEventsWithAttendance = [
          {
            event_id: 1,
            event_name: 'Workshop 1',
            organization_id: orgId,
            Attendances: [
              { attendance_id: 1, member_id: 10, event_id: 1 },
              { attendance_id: 2, member_id: 11, event_id: 1 }
            ]
          }
        ];
        
        // Set up the mock implementation
        Event.findAll.mockResolvedValue(mockEventsWithAttendance);
        
        // Call the function
        const result = await getEventsWithAttendance(orgId);
        
        // Assertions
        expect(Event.findAll).toHaveBeenCalledWith({
          where: { organization_id: orgId },
          include: expect.objectContaining({
            model: Attendance,
            as: 'Attendances'
          })
        });
        expect(result).toEqual(mockEventsWithAttendance);
      });
      
      it('should throw an error when fetching events with attendance fails', async () => {
        // Mock data
        const orgId = 1;
        const mockError = new Error('Fetch error');
        
        // Set up the mock to reject
        Event.findAll.mockRejectedValue(mockError);
        
        // Call the function and expect it to throw
        await expect(getEventsWithAttendance(orgId)).rejects.toThrow('Fetch error');
        expect(console.error).toHaveBeenCalledWith('Error in getEventsWithAttendance:', mockError);
      });
    });
  });