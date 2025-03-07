import { API_METHODS, getAPIData } from "./callAPI";
import { ROLE_ADMIN } from "./constants";

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
        let memberData = await getAPIData(`/organization/${membership.organization.organization_id}/member`, API_METHODS.get, {});

        if (memberData.hasOwnProperty("data")) {
            let members = [];
            memberData.data.forEach((member) => {
                // check if admin
                members.push({
                    name: member.member_name,
                    id: member.member_id
                })
            })
            // sort 
            data.members = members
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
