import { API_METHODS, getAPIData } from "./callAPI";
import { ROLE_MEMBER } from "./constants";

/**
 * 
 * @param {*} orgId - organization id that you are trying to find the role for
 * @returns {String} ROLE_MEMBER, ROLE_EBOARD, or ROLE_ADMIN
 */
export async function whatRoleAmI(orgId) {
    const memberInfo = await getAPIData("/member", API_METHODS.get, {})
    
    let role = ROLE_MEMBER;

    if (!memberInfo || memberInfo.hasOwnProperty("error") || !memberInfo.data.memberships) {
        console.log('do here')
        return role;
    }

    console.log(orgId)
    console.log(memberInfo.data)
    console.log(memberInfo.data.memberships)

    memberInfo.data.memberships.forEach(membership => {
        if (`${membership.organization_id}` === orgId) {
            role = membership.membership_role
        }
    });

    return role
}