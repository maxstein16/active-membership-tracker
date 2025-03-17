import * as React from "react";
import { useParams } from "react-router-dom";
import PageSetup from "../../components/PageSetup/PageSetup";
import BackButton from "../../components/BackButton";
import { API_METHODS, getAPIData } from "../../utils/callAPI";

export default function OrganizationStatusPage() {
  const { orgId } = useParams();
  let [posts, setPosts] = React.useState([]);
  let [loading, setLoading] = React.useState(false);
  let [memberships, setMemberships] = React.useState([]);
  let [orgData, setOrgData] = React.useState([]);
 
  var lot = useParams();
  //var th = getAPIData("/organization", API_METHODS.get);
  var thing ;
  async function loadData(){
    const result = await getAPIData("/organization/1/member/1", API_METHODS.get, {});
    return {data: result}
  }

//  let bob = async () => {
    
//     const result = await getAPIData("/organization/1/member/1", API_METHODS.get, {});
//   console.log(result);
//     if (!result) {
//       return;
//     }

//     if (result.status == "success") {
//       console.log(result);
//       return result;
//     }
//   };

 React.useEffect(() => {
 
  let loadPost = async () => {
    setLoading(true);
    const result = await getAPIData(`/organization/${orgId}/member/1`, API_METHODS.get, {});
    setPosts(result.data);

    setMemberships(result.data.membership);
    console.log("org id: " + orgId);

    const response = await getAPIData(
      `/organization/${orgId}`,
      API_METHODS.get,
      {}
    );
    let threshold = response.data.active_membership_threshold;
    setOrgData(response.data);

    setLoading(false);
    console.log(result.data);
    console.log("break");
    console.log(response.data);
  };
  loadPost();


//   console.log("Loaded");
//   const res = await getAPIData("/organization/1/member/1", API_METHODS.get, {});
// console.log("res done");
// console.log(res);
//   thing = loadData();
 }, []);


  return (
    <PageSetup>
      <BackButton route={"/"} />
      <h1>Organization Status Page</h1>
      <h1>Your Membership with WiC</h1>
      <p>You have been an active member for {memberships.active_semesters} semesters</p>
      
      <h3>{posts.member_id}</h3>

      <p>You have earned {memberships.membership_points} total points.</p>
      <p>Earn {
        (orgData.active_membership_threshold - memberships.membership_points)
        } more to become an active member this semester!</p>
      {/* <p>Org Id: {bob.data.membership.active_semesters}</p> */}
      <br />
      <h2>Computing Organization for Multicultural Students</h2>
      <p>Our mission is to build a supportive community that celebrates the talent of underrepresented students in Computing.
        We work to accomplish our mision by providing mentorship, mental health awareness, and leadership opportunities.
      </p>

    </PageSetup>
  );
}
