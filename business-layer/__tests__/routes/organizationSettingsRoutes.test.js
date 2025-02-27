const { getOrganizationSettingsInDB, getOrganizationEmailSettingsInDB, createOrganizationEmailSettingsInDB, updateOrganizationEmailSettingsInDB, deleteOrganizationEmailSettingsInDB, editOrganizationMembershipRequirementsInDB, deleteOrganizationMembershipRequirementInDB } = require("../../business-logic-layer/organizationSettingsProcessing");

const { getOrganizationById, getOrganizationMembershipRequirements, editOrganizationMembershipRequirement } = require("../../data-layer/organization");

const { getEmailSettings, createEmailSettings, updateEmailSettings, deleteEmailSettings } = require("../../data-layer/email-settings");

const Error = require("../../business-logic-layer/public/errors.js");
const { deleteMembershipRequirement } = require("../../data-layer/membership.js");
const error = new Error();

// Mock dependencies
jest.mock("../../data-layer/organization");
jest.mock("../../data-layer/email-settings");
jest.mock("../../data-layer/membership");

describe("Organization Settings Module", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getOrganizationSettingsInDB", () => {
        it("should return organization settings for a valid organization", async () => {
            getOrganizationById.mockResolvedValue({
                organization_id: 1,
                organization_name: "Test Org",
                organization_description: "This is a test organization",
            });

            getOrganizationMembershipRequirements.mockResolvedValue([
                {
                    requirement_id: 10,
                    meeting_type: "Weekly",
                    frequency: "Every Monday",
                    amount_type: "Hours",
                    amount: 2
                }
            ]);

            const result = await getOrganizationSettingsInDB(1);

            expect(result.error).toBe("No error.");
            expect(result.data).not.toBeNull();
            expect(result.data.organization_id).toBe(1);
            expect(result.data.Memberships.length).toBe(1);
        });

        it("should return an error if organization is not found", async () => {
            getOrganizationById.mockResolvedValue(null);

            const result = await getOrganizationSettingsInDB(1);

            expect(result.error).toBe(error.organizationNotFound);
            expect(result.data).toBeNull();
        });
    });

    describe("getOrganizationEmailSettingsInDB", () => {
        it("should return email settings for an organization", async () => {
            getEmailSettings.mockResolvedValue({
                org_id: 1,
                notification_email: "test@org.com",
                email_frequency: "Weekly"
            });

            const result = await getOrganizationEmailSettingsInDB(1);

            expect(result.error).toBe("No error.");
            expect(result.data.notification_email).toBe("test@org.com");
        });

        it("should return an error if email settings are not found", async () => {
            getEmailSettings.mockResolvedValue(null);

            const result = await getOrganizationEmailSettingsInDB(1);

            expect(result.error).toBe(error.settingNotFound);
            expect(result.data).toBeNull();
        });
    });

    describe("createOrganizationEmailSettingsInDB", () => {
        it("should create email settings successfully", async () => {
            getEmailSettings.mockResolvedValue(null);
            createEmailSettings.mockResolvedValue({
                org_id: 1,
                notification_email: "admin@org.com",
                email_frequency: "Daily"
            });

            const result = await createOrganizationEmailSettingsInDB(1, {
                notification_email: "admin@org.com",
                email_frequency: "Daily"
            });

            expect(result.error).toBe("No error.");
            expect(result.data.notification_email).toBe("admin@org.com");
        });

        it("should return an error if email settings already exist", async () => {
            getEmailSettings.mockResolvedValue({ org_id: 1 });

            const result = await createOrganizationEmailSettingsInDB(1, {
                notification_email: "admin@org.com",
                email_frequency: "Daily"
            });

            expect(result.error).toBe(error.settingsAlreadyExist);
            expect(result.data).toBeNull();
        });
    });

    describe("updateOrganizationEmailSettingsInDB", () => {
        it("should update email settings successfully", async () => {
            updateEmailSettings.mockResolvedValue({
                org_id: 1,
                notification_email: "updated@org.com",
                email_frequency: "Monthly"
            });

            const result = await updateOrganizationEmailSettingsInDB(1, {
                notification_email: "updated@org.com",
                email_frequency: "Monthly"
            });

            expect(result.error).toBe("No error.");
            expect(result.data.notification_email).toBe("updated@org.com");
        });

        it("should return an error if email settings are not found", async () => {
            updateEmailSettings.mockResolvedValue(null);

            const result = await updateOrganizationEmailSettingsInDB(1, {
                notification_email: "updated@org.com",
                email_frequency: "Monthly"
            });

            expect(result.error).toBe(error.settingNotFound);
            expect(result.data).toBeNull();
        });
    });

    describe("deleteOrganizationEmailSettingsInDB", () => {
        it("should delete email settings successfully", async () => {
            deleteEmailSettings.mockResolvedValue(true);

            const result = await deleteOrganizationEmailSettingsInDB(1);

            expect(result.error).toBe("No error.");
            expect(result.data.deleted).toBe(true);
        });

        it("should return an error if email settings are not found", async () => {
            deleteEmailSettings.mockResolvedValue(false);

            const result = await deleteOrganizationEmailSettingsInDB(1);

            expect(result.error).toBe(error.settingNotFound);
            expect(result.data).toBeNull();
        });
    });

    describe("editOrganizationMembershipRequirementsInDB", () => {
        it("should edit membership requirements successfully", async () => {
            getOrganizationById.mockResolvedValue({ organization_id: 1 });
            editOrganizationMembershipRequirement.mockResolvedValue(true);

            const result = await editOrganizationMembershipRequirementsInDB(1, {
                requirement_id: 10,
                meeting_type: "Bi-Weekly",
                frequency: "Every Friday",
                amount_type: "Hours",
                amount: 3
            });

            expect(result.error).toBe("No error.");
            expect(result.data.requirement_id).toBe(10);
            expect(result.data.meeting_type).toBe("Bi-Weekly");
        });

        it("should return an error if organization is not found", async () => {
            getOrganizationById.mockResolvedValue(null);

            const result = await editOrganizationMembershipRequirementsInDB(1, {
                requirement_id: 10,
                meeting_type: "Bi-Weekly",
                frequency: "Every Friday",
                amount_type: "Hours",
                amount: 3
            });

            expect(result.error).toBe(error.organizationNotFound);
            expect(result.data).toBeNull();
        });
    });

    describe("deleteOrganizationMembershipRequirementInDB", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        
        it("should delete a membership requirement successfully", async () => {
            getOrganizationById.mockResolvedValue({ organization_id: 1 });
            getOrganizationMembershipRequirements.mockResolvedValue([{ requirement_id: 10 }]);
            // Add this mock
            deleteMembershipRequirement.mockResolvedValue(true);
            
            const result = await deleteOrganizationMembershipRequirementInDB(1, 10);
                    
            expect(result.error).toBe("No error.");
            expect(result.data).not.toBeNull();
            expect(result.data.deleted).toBe(true);
        });
    });
});
