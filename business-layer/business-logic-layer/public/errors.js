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
  this.memberCannotBeFoundInDB = "Member cannot be found";
  this.mustIncludeMemberId = "Must include a member id in your call";
  this.mustIncludeValidFieldAddMember = "Must include at least one valid field to update: personal_email, phone_number, gender, race, tshirt_size, major, or graduation_date";

  // Organization Calls

  // Organization Settings Calls
  
  // Organization Reports Calls

};

