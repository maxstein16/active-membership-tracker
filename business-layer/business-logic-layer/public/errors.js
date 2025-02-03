// export to api request
module.exports = function () {
  // General
  this.noError = "no error";
  this.somethingWentWrong = "Something went wrong, please try again";
  this.organizationIdMustBeInteger = "OrganizationId must be an integer";
  this.memberIdMustBeInteger = "MemberId must be an integer";
  this.orgNotFound = "Organization Not Found"
  this.memberNotFound = "Member Not Found"
  
  // Member In Org Management

  this.mustHaveAllFieldsAddMemberInOrg = "Must include all the fields: member_name, member_email, member_personal_email, member_phone_number, member_graduation_date, member_tshirt_size, member_major, member_gender, member_race, role";
  this.mustHaveAtLeastOneFieldsAddMemberInOrg = "Must include at least one valid field to update: member_name, member_email, member_personal_email, member_phone_number, member_graduation_date, member_tshirt_size, member_major, member_gender, member_race, role";
  this.memberCanNotBeAddedToOrg = "Can not add member to organization";
  this.memberNotFoundInOrg = "Member not found in organization";

  // Member Calls (not org specific)

  // Organization Calls

  // Organization Settings Calls
  this.settingIdMustBeInteger = "Setting ID must be an integer";
  this.mustHaveAtLeastOneFieldToUpdate = "Must include at least one valid field to update: meeting_type, frequency, amount_type, amount";
  this.organizationNotFound = "Organization with the given ID not found";
  this.settingNotFound = "Organization setting with the given ID not found";
  this.mustIncludeIdQueryParam = "Must include an ID as a query param";
  this.mustIncludeAtLeastOneValidFieldToEdit = "Must include at least one valid field to edit: current_status, annual_report, semester_report, membership_achieved";
  // Organization Reports Calls

  // Event Management
  this.eventIdMustBeInteger = "EventId must be an integer";
  this.eventNotFound = "Event not found";
  this.mustHaveAllFieldsCreateEvent = "Must include all required event fields: event_name, event_start, event_end, event_location, event_description, event_type";
  this.mustHaveAtLeastOneFieldToUpdateEvent = "Must include at least one valid field to update an event";

};

