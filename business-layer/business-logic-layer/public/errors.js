// export to api request
module.exports = function () {
  // General
  this.noError = "no error";
  this.somethingWentWrong = "Something went wrong, please try again";
  this.organizationIdMustBeInteger = "OrganizationId must be an integer";
  this.memberIdMustBeInteger = "MemberId must be an integer";
  this.roleMustBeInteger = "MemberId must be an integer";
  this.orgNotFound = "Organization Not Found"
  this.memberNotFound = "Member Not Found"
  this.membershipNotFound = "Membership Not Found"
  this.youDoNotHavePermission = "You do not have permissions for this action"
  this.roleMustBeAnInteger = "Organization Role must be an integer"

  // Member In Org Management

  this.mustHaveAllFieldsAddMemberInOrg = "Must include all the fields: member_id and role";
  this.mustHaveAtLeastOneFieldsAddMemberInOrg = "Must include at least one valid field to update: membership_points, role";
  this.memberCanNotBeAddedToOrg = "Can not add member to organization";
  this.memberNotFoundInOrg = "Member not found in organization";
  this.memberMustEditAttendanceField = "Must edit at least one valid field: meetings_attended, volunteer_events, social_events";
  this.mustHaveAllFieldsEditMemberRoleInOrg = "Missing required fields: member_id, organization_id, role";
  this.couldNotCreateMembership = "Could not create membership";
  this.noCurrentSemesterFound = "No current semester found";
  this.memberPointsNaN = "Member Points must be an integer";


  // Member Calls (not org specific)
  this.memberCannotBeFoundInDB = "Member cannot be found";
  this.mustIncludeMemberId = "Must include a member id in your call";
  this.mustIncludeValidFieldAddMember = "Must include at least one valid field to update: personal_email, phone_number, gender, race, tshirt_size, major, or graduation_date";
  this.mustIncludeValidMemberId = "Must include a valid member ID";

  // Organization Calls
  this.validationError = "Validation error: One or more fields are invalid";
  this.mustIncludeOrgId = "Must include an organization ID";
  this.mustHaveAllFieldsAddOrg = "Must include fields: org_name, org_description, org_category, org_contact_email, org_phone_number";
  this.invalidOrgName = "Organization name is invalid. It must be a non-empty string.";
  this.invalidOrgDescription = "Organization description is invalid. It must be a non-empty string.";
  this.invalidOrgCategory = "Organization category is invalid. It must be a non-empty string.";
  this.invalidOrgEmail = "Invalid contact email format.";
  this.invalidOrgPhoneNumber = "Invalid phone number format. Example: 555-123-4567.";
  this.addOrgFailed = "Organization creation failed. Please try again.";
  this.databaseError = "Database error. Unable to process the request.";
  this.permissionDenied = "You do not have permission to add an organization.";
  this.invalidOrganizationId = "Organization ID must be a positive integer.";
  this.noError = "No error.";
  this.mustIncludeOrgId = "Must include an organization ID in your call.";
  this.mustHaveAtLeastOneFieldsEditOrg = "Must include at least one valid field to edit: organization_name, organization_abbreviation, organization_desc, organization_color, organization_threshold";

  // Edit Organization Errors
  this.mustHaveAtLeastOneFieldsEditOrg = "Must include at least one valid field to edit: org_name, org_description, org_category, org_contact_email, org_phone_number.";
  this.orgNotFound = "Organization not found";



  // Organization Settings Calls
  this.settingIdMustBeInteger = "Setting ID must be an integer";
  this.mustHaveAtLeastOneFieldToUpdate = "Must include at least one valid field to update: meeting_type, frequency, amount_type, amount";
  this.organizationNotFound = "Organization with the given ID not found";
  this.settingNotFound = "Organization setting with the given ID not found";
  this.mustIncludeIdQueryParam = "Must include an ID as a query param";
  this.mustIncludeAtLeastOneValidFieldToEdit = "Must include at least one valid field to edit: current_status, annual_report, semester_report, membership_achieved";

  // Organization Reports Calls
  this.cannotCreateReport = "Error Creating Report";

  // Event Management
  this.eventIdMustBeInteger = "EventId must be an integer";
  this.eventNotFound = "Event not found";
  this.mustHaveAllFieldsCreateEvent = "Must include all required event fields: event_name, event_start, event_end, event_location, event_description, event_type";
  this.mustHaveAtLeastOneFieldToUpdateEvent = "Must include at least one valid field to update an event";

  // Organization Recognition Calls
  this.mustHaveMembershipYearsField = "Must include field 'membership_years' in the request body to edit."
  this.noRecognitionsFound = "There are no recognitions found"
  this.thisOrgHasNoRecognitions = "This organization has no active member recognitions"


  //CSV file upload errors
  this.organizationIdMustBeInteger = "Organization ID must be an integer.";
  this.csvProcessingFailed = "Failed to process the CSV file.";
  this.fileCleanupFailed = "Failed to delete the uploaded CSV file.";
  this.genericProcessingError = "An unexpected error occurred during processing.";
  this.fileProcessingFailed = "Failed to process the CSV file.";
  this.emailExistenceCheckError = "Error while checking email existence in the DB"


  //Attendance data
  this.attendanceIdMustBeInteger = "Attendance has to be an Integer."
  this.attendanceNotFound = "Attendance has not been found"

  // Semester Management
  this.semesterIdMustBeInteger = "Semester ID must be an integer";
};

