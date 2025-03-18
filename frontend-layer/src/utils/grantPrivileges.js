import { API_METHODS, getAPIData } from "./callAPI";
import { ROLE_ADMIN, ROLE_EBOARD } from "./constants";

/**
 * Gets the organizations you are an admin of, as well as the members in those organizations
 * @returns {List} that contains this data:  (only returns eboards and members, not admins)
 *     [
 *          {
 *              name: "Women In Computing"
 *              id: 1
 *              members: [
 *                  {
 *                      name: "Anoushka Shenoy",
 *                      id: 12
 *                  },
 *                  ...
 *              ]
 *          },
 *          ...
 *     ]
 */
export async function getOptionsForPrivilege() {
  // get possible organizations
  let membershipsData = await getAPIData("/member", API_METHODS.get, {});

  if (!membershipsData) {
    console.log("must login", membershipsData);
    return { session: false };
  }

  if (membershipsData.hasOwnProperty("error")) {
    console.log("Something went wrong creating the new org: ", membershipsData);
    return { error: true };
  }

  // for each org:
  // if role is admin
  // format the data correctly
  // get all the eboard + members
  let returnData = [];
  await new Promise((resolve, reject) => {
    membershipsData.data.memberships.forEach(async (membership, index) => {
      if (membership.membership_role === ROLE_ADMIN) {
        let data = {
          name: membership.organization.organization_name,
          id: membership.organization.organization_id,
          members: [],
        };
        // get members who are not admin
        // sort them alphabetically by name
        let memberData = await getAPIData(
          `/organization/${membership.organization.organization_id}/member`,
          API_METHODS.get,
          {}
        );

        if (memberData.hasOwnProperty("data")) {
          let members = [];
          memberData.data.forEach((member) => {
            // check if admin
            if (member.membership_role !== ROLE_ADMIN) {
              members.push({
                name: member.member_name,
                id: member.member_id,
              });
            }
          });
          // sort
          data.members = members.sort(sortByName);
        }

        returnData.push(data);

        if (index === membershipsData.data.memberships.length - 1) {
          resolve();
        }
      }
    });
  });

  return returnData;
}

// sort the members by name
function sortByName(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

/**
   * 
   * @param {Obj} data - data that is stored in GrantPrivilegePage:
     {
        orgNameSelected: "",
        memberNameSelected: "",
        role: "",
        possibleOrgs: [],
        possibleMembers: [],
        apiData: [] - from the first function above
      };
      @return {Boolean} - true if no error, false if error
   */
export async function grantPrivilegeInDB(data) {
  // Get the IDs from the API data
  let orgData = data.apiData.filter(
    (org) => org.name === data.orgNameSelected
  )[0];
  const orgId = orgData.id;
  let memberInfo = orgData.members.filter(
    (member) => member.name === data.memberNameSelected
  )[0];
  const memberId = memberInfo.id;

  // get role id
  let roleId = ROLE_EBOARD
  if (data.role === "Admin") {
    roleId = ROLE_ADMIN
  }

  // use the IDs to call the db
  const result = await getAPIData(
    `/organization/${orgId}/member/${memberId}`,
    API_METHODS.put,
    {role: roleId}
  );

  if (!result || result.hasOwnProperty("error")) {
    console.log("Error granting privilege: ", result)
    return false;
  }
  return true;
}
