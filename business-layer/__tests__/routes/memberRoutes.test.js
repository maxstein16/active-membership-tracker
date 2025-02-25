const { createMember, updateMember, getAllMembers, getMemberById, getMembersByAttributes } = require('../../data-layer/member');

const { Member } = require('../../db');

// Mock the database model
jest.mock('../../db.js', () => ({
  Member: {
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn()
  }
}));

describe('Member module', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Configure console methods to prevent logging during tests
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe('createMember', () => {
    it('should create a new member successfully', async () => {
      // Mock data
      const memberData = {
        member_name: 'John Doe',
        member_email: 'john@example.com',
        member_personal_email: 'john.personal@example.com'
      };
      
      const mockCreatedMember = {
        ...memberData,
        member_id: 1,
        toJSON: jest.fn().mockReturnValue({ ...memberData, member_id: 1 })
      };
      
      // Set up the mock implementation
      Member.create.mockResolvedValue(mockCreatedMember);
      
      // Call the function
      const result = await createMember(memberData);
      
      // Assertions
      expect(Member.create).toHaveBeenCalledWith(memberData);
      expect(result).toEqual(mockCreatedMember);
      expect(console.log).toHaveBeenCalledWith('Member created:', mockCreatedMember.toJSON());
    });
  });
  
  describe('updateMember', () => {
    it('should update a member successfully', async () => {
      // Mock data
      const memberId = 1;
      const updateData = {
        member_name: 'John Updated',
        member_email: 'john.updated@example.com'
      };
      
      // Set up the mock implementation
      Member.update.mockResolvedValue([1]); // means 1 row was updated
      
      // Call the function
      const result = await updateMember(memberId, updateData);
      
      // Assertions
      expect(Member.update).toHaveBeenCalledWith(updateData, {
        where: { member_id: memberId }
      });
      expect(result).toBe(true);
      expect(console.log).toHaveBeenCalledWith(`Member with ID ${memberId} updated successfully.`);
    });
    
    it('should return false when no member is found to update', async () => {
      // Mock data
      const memberId = 999;
      const updateData = {
        member_name: 'Non-existent Member'
      };
      
      // Set up the mock implementation
      Member.update.mockResolvedValue([0]); // means 0 rows were updated
      
      // Call the function
      const result = await updateMember(memberId, updateData);
      
      // Assertions
      expect(result).toBe(false);
      expect(console.log).toHaveBeenCalledWith(`No member found with ID ${memberId}.`);
    });
  });
  
  describe('getAllMembers', () => {
    it('should return all members', async () => {
      // Mock data
      const mockMembers = [
        {
          member_id: 1,
          member_name: 'John Doe',
          toJSON: jest.fn().mockReturnValue({ member_id: 1, member_name: 'John Doe' })
        },
        {
          member_id: 2,
          member_name: 'Jane Doe',
          toJSON: jest.fn().mockReturnValue({ member_id: 2, member_name: 'Jane Doe' })
        }
      ];
      
      // Set up the mock implementation
      Member.findAll.mockResolvedValue(mockMembers);
      
      // Call the function
      const result = await getAllMembers();
      
      // Assertions
      expect(Member.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockMembers);
      expect(console.log).toHaveBeenCalledWith('Members found:', mockMembers.map(m => m.toJSON()));
    });
    
    it('should return an empty array when no members exist', async () => {
      // Set up the mock implementation
      Member.findAll.mockResolvedValue([]);
      
      // Call the function
      const result = await getAllMembers();
      
      // Assertions
      expect(result).toEqual([]);
      expect(console.log).toHaveBeenCalledWith('No members found in the database.');
    });
  });
  
  describe('getMemberById', () => {
    it('should return a member when found by id', async () => {
      // Mock data
      const memberId = 1;
      const mockMember = {
        member_id: memberId,
        member_name: 'John Doe',
        toJSON: jest.fn().mockReturnValue({ member_id: memberId, member_name: 'John Doe' })
      };
      
      // Set up the mock implementation
      Member.findByPk.mockResolvedValue(mockMember);
      
      // Call the function
      const result = await getMemberById(memberId);
      
      // Assertions
      expect(Member.findByPk).toHaveBeenCalledWith(memberId);
      expect(result).toEqual(mockMember);
      expect(console.log).toHaveBeenCalledWith('Member found:', mockMember.toJSON());
    });
    
    it('should return null when no member is found by id', async () => {
      // Mock data
      const memberId = 999;
      
      // Set up the mock implementation
      Member.findByPk.mockResolvedValue(null);
      
      // Call the function
      const result = await getMemberById(memberId);
      
      // Assertions
      expect(result).toBeNull();
      expect(console.log).toHaveBeenCalledWith(`No member found with ID ${memberId}.`);
    });
  });
  
  describe('getMembersByAttributes', () => {
    it('should return members matching the given attributes', async () => {
      // Mock data
      const filters = { member_email: 'test@example.com' };
      const mockMembers = [
        {
          member_id: 1,
          member_name: 'Test User',
          member_email: 'test@example.com',
          toJSON: jest.fn().mockReturnValue({ 
            member_id: 1, 
            member_name: 'Test User', 
            member_email: 'test@example.com' 
          })
        }
      ];
      
      // Set up the mock implementation
      Member.findAll.mockResolvedValue(mockMembers);
      
      // Call the function
      const result = await getMembersByAttributes(filters);
      
      // Assertions
      expect(Member.findAll).toHaveBeenCalledWith({ where: filters });
      expect(result).toEqual(mockMembers);
      expect(console.log).toHaveBeenCalledWith('Members found:', mockMembers.map(m => m.toJSON()));
    });
    
    it('should return an empty array when no members match the attributes', async () => {
      // Mock data
      const filters = { member_email: 'nonexistent@example.com' };
      
      // Set up the mock implementation
      Member.findAll.mockResolvedValue([]);
      
      // Call the function
      const result = await getMembersByAttributes(filters);
      
      // Assertions
      expect(result).toEqual([]);
      expect(console.log).toHaveBeenCalledWith('No members found matching the given criteria.');
    });
  });
});