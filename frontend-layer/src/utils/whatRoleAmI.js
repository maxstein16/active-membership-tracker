// import { API_METHODS, getAPIData } from "./callAPI";
// import { ROLE_ADMIN, ROLE_MEMBER } from "./constants";

import { ROLE_ADMIN } from "./constants";

/**
 * 
 * @param {*} orgId - organization id that you are trying to find the role for
 * @returns {String} ROLE_MEMBER, ROLE_EBOARD, or ROLE_ADMIN
 */
export async function whatRoleAmI(orgId) {
    // const memberInfo = await getAPIData("/member", API_METHODS.get, {})
    
    // let role = ROLE_MEMBER;

    // if (!memberInfo.memberships) {
    //     return role;
    // }

    // memberInfo.memberships.forEach(membership => {
    //     if (membership.organization_id === orgId) {
    //         role = membership.membership_role
    //     }
    // });
    // return role
    return ROLE_ADMIN
}