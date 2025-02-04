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
  
  // Member In Org Management

  this.mustHaveAllFieldsAddMemberInOrg = "Must include all the fields: member_name, member_email, member_personal_email, member_phone_number, member_graduation_date, member_tshirt_size, member_major, member_gender, member_race, role";
  this.mustHaveAtLeastOneFieldsAddMemberInOrg = "Must include at least one valid field to update: member_name, member_email, member_personal_email, member_phone_number, member_graduation_date, member_tshirt_size, member_major, member_gender, member_race, role";
  this.memberCanNotBeAddedToOrg = "Can not add member to organization";
  this.memberNotFoundInOrg = "Member not found in organization";
  this.memberMustEditAttendanceField = "Must edit at least one valid field: meetings_attended, volunteer_events, social_events";
  this.mustHaveAllFieldsEditMemberRoleInOrg = "Missing required fields: member_id, organization_id, role";


  // Member Calls (not org specific)
  this.memberCannotBeFoundInDB = "Member cannot be found";
  this.mustIncludeMemberId = "Must include a member id in your call";
  this.mustIncludeValidFieldAddMember = "Must include at least one valid field to update: personal_email, phone_number, gender, race, tshirt_size, major, or graduation_date";

  // Organization Calls
  this.mustHaveAllFieldsAddOrg = "Must include feilds: organization_name, organization_abbreviation, organization_desc, organization_color, active_membership_threshold";
  this.mustHaveAtLeastOneFieldsEditOrg = "Must include at least one valid feild to edit: organization_name, organization_abbreviation, organization_desc, organization_color, active_membership_threshold";
  

  // Organization Settings Calls
  this.settingIdMustBeInteger = "Setting ID must be an integer";
  this.mustHaveAtLeastOneFieldToUpdate = "Must include at least one valid field to update: meeting_type, frequency, amount_type, amount";
  this.organizationNotFound = "Organization with the given ID not found";
  this.settingNotFound = "Organization setting with the given ID not found";
  this.mustIncludeIdQueryParam = "Must include an ID as a query param";
  this.mustIncludeAtLeastOneValidFieldToEdit = "Must include at least one valid field to edit: current_status, annual_report, semester_report, membership_achieved";
  
  // Organization Reports Calls

  // Organization Recognition Calls
  this.mustHaveMembershipYearsField = "Must include field 'membership_years' in the request body to edit."

};

