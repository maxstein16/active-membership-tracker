const {
  getSpecificOrgDataInDB,
  createOrganizationInDB,
  updateOrganizationInDB,
  getAllOrganizationDataInDB,
} = require("../../business-logic-layer/organizationProcessing.js");

const {
  getOrganizationById,
  createOrganization,
  updateOrganizationByID,
  getOrganizations,
} = require("../../data-layer/organization.js");

const Error = require("../../business-logic-layer/public/errors.js");
const error = new Error();

// Mock dependencies
jest.mock("../../data-layer/organization");

describe("Organization Module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getSpecificOrgDataInDB", () => {
    it("should return organization data for a valid ID", async () => {
      getOrganizationById.mockResolvedValue({
        organization_id: 1,
        organization_name: "Test Org",
        organization_description: "A test organization",
        organization_color: "#FFFC76",
        organization_abbreviation: "test",
        organization_email: "test@org.com",
        organization_membership_type: "points",
        organization_threshold: "25",
      });

      const result = await getSpecificOrgDataInDB(1);

      expect(result.error).toBe(null);
      expect(result.data.organization_name).toBe("Test Org");
    });

    it("should return an error if organization ID is invalid", async () => {
      const result = await getSpecificOrgDataInDB("invalid");
      expect(result.error).toBe(error.organizationIdMustBeInteger);
      expect(result.data).toBeNull();
    });

    it("should return an error if organization is not found", async () => {
      getOrganizationById.mockResolvedValue(null);

      const result = await getSpecificOrgDataInDB(999);
      expect(result.error).toBe(error.notFound);
      expect(result.data).toBeNull();
    });
  });

  describe("createOrganizationInDB", () => {
    it("should create an organization successfully", async () => {
      createOrganization.mockResolvedValue({
        organization_id: 1,
        organization_name: "Test Org",
        organization_description: "A test organization",
        organization_color: "#FFFC76",
        organization_abbreviation: "test",
        organization_email: "test@org.com",
        organization_membership_type: "points",
        organization_threshold: "25",
      });

      const orgData = {
        organization_name: "Test Org",
        organization_description: "A test organization",
        organization_color: "#FFFC76",
        organization_abbreviation: "test",
        organization_email: "test@org.com",
        organization_membership_type: "points",
        organization_threshold: "25",
      };

      const result = await createOrganizationInDB(orgData);

      expect(result.error).toBe(null);
      expect(result.data.organization_name).toBe("Test Org");
    });

    it("should return an error for invalid organization data", async () => {
      const orgData = { organization_name: "" }; // Invalid name
      const result = await createOrganizationInDB(orgData);
      expect(result.error).toBe(error.invalidOrgName);
      expect(result.data).toBeNull();
    });
  });

  describe("updateOrganizationInDB", () => {
    it("should update an organization successfully", async () => {
      updateOrganizationByID.mockResolvedValue(true);

      const result = await updateOrganizationInDB(1, {
        organization_name: "Updated Org",
      });
      expect(result.error).toBe(null);
      expect(result.data.message).toBe("Organization updated successfully.");
    });

    it("should return an error for invalid organization ID", async () => {
      const result = await updateOrganizationInDB("invalid", {
        organization_name: "Updated Org",
      });
      expect(result.error).toBe(error.invalidOrganizationId);
      expect(result.data).toBeNull();
    });

    it("should return an error if organization is not found", async () => {
      updateOrganizationByID.mockResolvedValue(false);

      const result = await updateOrganizationInDB(999, {
        organization_name: "Updated Org",
      });
      expect(result.error).toBe(error.orgNotFound);
      expect(result.data).toBeNull();
    });
  });

  describe("getAllOrganizationDataInDB", () => {
    it("should return a list of organizations", async () => {
      getOrganizations.mockResolvedValue([
        {
          organization_id: 1,
          organization_name: "Test Org",
          organization_description: "A test organization",
          organization_color: "#FFFC76",
          organization_abbreviation: "test",
          organization_email: "test@org.com",
          organization_membership_type: "points",
          organization_threshold: "25",
        },
      ]);

      const result = await getAllOrganizationDataInDB();
      expect(result.error).toBe(null);
      expect(result.data.length).toBe(1);
      expect(result.data[0].organization_name).toBe("Test Org");
    });

    it("should return an empty list if no organizations exist", async () => {
      getOrganizations.mockResolvedValue([]);

      const result = await getAllOrganizationDataInDB();
      expect(result.error).toBe(null);
      expect(result.data.length).toBe(0);
    });
  });
});
