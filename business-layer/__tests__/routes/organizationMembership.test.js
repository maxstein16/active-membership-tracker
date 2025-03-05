const { createMembership, editMembership, editMembershipRole, getMembershipsByAttributes, getMembershipByAttributes, getMembershipsByOrgAndSemester } = require('../../data-layer/membership');
  
  // Mock the database models
  jest.mock('../../db.js', () => {
    const Member = {
      findOne: jest.fn()
    };
  
    const Membership = {
      create: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn()
    };
  
    return {
      Membership,
      Member
    };
  });
  
  const { Membership, Member } = require('../../db');
  
  describe('Membership module', () => {
    beforeEach(() => {
      // Clear all mocks before each test
      jest.clearAllMocks();
      
      // Configure console methods to prevent logging during tests
      console.log = jest.fn();
      console.error = jest.fn();
    });
  
    describe('createMembership', () => {
      it('should create a new membership record successfully', async () => {
        // Mock data
        const membershipData = {
          organization_id: 1,
          member_id: 5,
          semester_id: 20,
          membership_role: 2
        };
        
        const mockCreatedMembership = {
          ...membershipData,
          membership_id: 1,
          toJSON: jest.fn().mockReturnValue({ ...membershipData, membership_id: 1 })
        };
        
        // Set up the mock implementation
        Membership.create.mockResolvedValue(mockCreatedMembership);
        
        // Call the function
        const result = await createMembership(membershipData);
        
        // Assertions
        expect(Membership.create).toHaveBeenCalledWith(membershipData);
        expect(result).toEqual(mockCreatedMembership);
      });
  
      it('should throw an error if membership creation fails', async () => {
        // Mock data
        const membershipData = {
          organization_id: 1,
          member_id: 5,
          semester_id: 20,
          membership_role: 2
        };
        
        // Set up the mock implementation to throw an error
        const mockError = new Error('Database connection error');
        Membership.create.mockRejectedValue(mockError);
        
        // Assert that the function throws the error
        await expect(createMembership(membershipData)).rejects.toThrow('Database connection error');
      });
    });
    
    describe('editMembership', () => {
      it('should update an existing membership record successfully', async () => {
        // Mock data
        const membershipId = 1;
        const updates = {
          membership_role: 3
        };
        
        const mockExistingMembership = {
          membership_id: membershipId,
          organization_id: 1,
          member_id: 5,
          semester_id: 20,
          membership_role: 2,
          update: jest.fn().mockResolvedValue({
            membership_id: membershipId,
            ...updates,
            organization_id: 1,
            member_id: 5,
            semester_id: 20
          })
        };
        
        // Set up the mock implementation
        Membership.findByPk.mockResolvedValue(mockExistingMembership);
        
        // Call the function
        const result = await editMembership(membershipId, updates);
        
        // Assertions
        expect(Membership.findByPk).toHaveBeenCalledWith(membershipId);
        expect(mockExistingMembership.update).toHaveBeenCalledWith(updates);
        expect(result.membership_role).toBe(3);
      });
      
      it('should return null when membership is not found', async () => {
        // Mock data
        const membershipId = 999;
        const updates = {
          membership_role: 3
        };
        
        // Set up the mock implementation
        Membership.findByPk.mockResolvedValue(null);
        
        // Call the function
        const result = await editMembership(membershipId, updates);
        
        // Assertions
        expect(result).toBeNull();
      });
    });
    
    describe('editMembershipRole', () => {
      it('should update the role of an existing membership record', async () => {
        // Mock data
        const membershipId = 1;
        const newRole = 3;
        
        const mockExistingMembership = {
          membership_id: membershipId,
          organization_id: 1,
          member_id: 5,
          semester_id: 20,
          membership_role: 2,
          save: jest.fn().mockResolvedValue({
            membership_id: membershipId,
            organization_id: 1,
            member_id: 5,
            semester_id: 20,
            membership_role: newRole
          })
        };
        
        // Set up the mock implementation
        Membership.findByPk.mockResolvedValue(mockExistingMembership);
        
        // Call the function
        const result = await editMembershipRole(membershipId, newRole);
        
        // Assertions
        expect(Membership.findByPk).toHaveBeenCalledWith(membershipId);
        expect(mockExistingMembership.membership_role).toBe(newRole);
        expect(mockExistingMembership.save).toHaveBeenCalled();
        expect(result.membership_role).toBe(newRole);
      });
      
      it('should return null when membership is not found', async () => {
        // Mock data
        const membershipId = 999;
        const newRole = 3;
        
        // Set up the mock implementation
        Membership.findByPk.mockResolvedValue(null);
        
        // Call the function
        const result = await editMembershipRole(membershipId, newRole);
        
        // Assertions
        expect(result).toBeNull();
      });
    });
    
    describe('getMembershipsByAttributes', () => {
      it('should return memberships matching the given filters', async () => {
        // Mock data
        const filters = {
          organization_id: 1,
          semester_id: 20
        };
        
        const mockMemberships = [
          {
            membership_id: 1,
            organization_id: 1,
            member_id: 5,
            semester_id: 20,
            membership_role: 2,
            toJSON: jest.fn().mockReturnValue({
              membership_id: 1,
              organization_id: 1,
              member_id: 5,
              semester_id: 20,
              membership_role: 2
            })
          },
          {
            membership_id: 2,
            organization_id: 1,
            member_id: 6,
            semester_id: 20,
            membership_role: 3,
            toJSON: jest.fn().mockReturnValue({
              membership_id: 2,
              organization_id: 1,
              member_id: 6,
              semester_id: 20,
              membership_role: 3
            })
          }
        ];
        
        // Set up the mock implementation
        Membership.findAll.mockResolvedValue(mockMemberships);
        
        // Call the function
        const result = await getMembershipsByAttributes(filters);
        
        // Assertions
        expect(Membership.findAll).toHaveBeenCalledWith({ where: filters });
        expect(result).toEqual(mockMemberships);
        expect(result.length).toBe(2);
      });
      
      it('should return an empty array when no memberships match the filters', async () => {
        // Mock data
        const filters = {
          organization_id: 999,
          semester_id: 99
        };
        
        // Set up the mock implementation
        Membership.findAll.mockResolvedValue([]);
        
        // Call the function
        const result = await getMembershipsByAttributes(filters);
        
        // Assertions
        expect(result).toEqual([]);
      });
    });
    
    describe('getMembershipByAttributes', () => {
      it('should return a single membership matching the given filters', async () => {
        // Mock data
        const filters = {
          organization_id: 1,
          member_id: 5,
          semester_id: 20
        };
        
        const mockMembership = {
          membership_id: 1,
          organization_id: 1,
          member_id: 5,
          semester_id: 20,
          membership_role: 2,
          toJSON: jest.fn().mockReturnValue({
            membership_id: 1,
            organization_id: 1,
            member_id: 5,
            semester_id: 20,
            membership_role: 2
          })
        };
        
        // Set up the mock implementation
        Membership.findOne.mockResolvedValue(mockMembership);
        
        // Call the function
        const result = await getMembershipByAttributes(filters);
        
        // Assertions
        expect(Membership.findOne).toHaveBeenCalledWith({ where: filters });
        expect(result).toEqual(mockMembership);
      });
      
      it('should return null when no membership matches the filters', async () => {
        // Mock data
        const filters = {
          organization_id: 999,
          member_id: 999,
          semester_id: 99
        };
        
        // Set up the mock implementation
        Membership.findOne.mockResolvedValue(null);
        
        // Call the function
        const result = await getMembershipByAttributes(filters);
        
        // Assertions
        expect(result).toBeNull();
      });
    });
    
    describe('getMembershipsByOrgAndSemester', () => {
      it('should return memberships for an organization across multiple semesters', async () => {
        // Mock data
        const orgId = 1;
        const semesterIds = [20, 21];
        
        const mockMemberships = [
          {
            membership_id: 1,
            organization_id: orgId,
            member_id: 5,
            semester_id: 20,
            membership_role: 2,
            Member: {
              member_id: 5,
              member_name: 'John Doe'
            }
          },
          {
            membership_id: 2,
            organization_id: orgId,
            member_id: 6,
            semester_id: 21,
            membership_role: 3,
            Member: {
              member_id: 6,
              member_name: 'Jane Smith'
            }
          }
        ];
        
        // Set up the mock implementation
        Membership.findAll.mockResolvedValue(mockMemberships);
        
        // Call the function
        const result = await getMembershipsByOrgAndSemester(orgId, semesterIds);
        
        // Assertions
        expect(Membership.findAll).toHaveBeenCalledWith({
          where: { 
            organization_id: orgId,
            semester_id: semesterIds
          },
          include: [{
            model: Member,
            required: true
          }]
        });
        expect(result).toEqual(mockMemberships);
        expect(result.length).toBe(2);
      });
      
      it('should throw an error if database query fails', async () => {
        // Mock data
        const orgId = 1;
        const semesterIds = [20, 21];
        
        // Set up the mock implementation to throw an error
        const mockError = new Error('Database query error');
        Membership.findAll.mockRejectedValue(mockError);
        
        // Assert that the function throws the error
        await expect(
          getMembershipsByOrgAndSemester(orgId, semesterIds)
        ).rejects.toThrow('Database query error');
      });
    });
  });