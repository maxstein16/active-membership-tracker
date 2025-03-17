import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";
import  { PureComponent } from 'react';
import { useParams } from "react-router-dom";
import PageSetup from "../../components/PageSetup/PageSetup";
import BackButton from "../../components/BackButton";
import { API_METHODS, getAPIData } from "../../utils/callAPI";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';


export default function OrganizationStatusPage() {
  const { orgId } = useParams();
  let [posts, setPosts] = React.useState([]);
  let [loading, setLoading] = React.useState(false);
  let [memberships, setMemberships] = React.useState([]);
  let [orgData, setOrgData] = React.useState([]);
  let [data, setData] = React.useState([]);
  let [activeIndex, setActiveIndex] = React.useState(0);
  let [memberText, setMemberText] = React.useState([]);
  let [chartText, setChartText] = React.useState([]);

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

let progressToMember = 0;

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

   
    console.log(result.data);
    console.log("break");
    console.log(response.data);

    let data = [
      {name: 'completed', value: orgData.active_membership_threshold},
      {name: 'progress', value: memberships.membership_points}

    ];

    setData(data);
     if(memberships.membership_points >= orgData.active_membership_threshold){
    setMemberText(`Your total points this semester are ${memberships.membership_points}! That is ${(memberships.membership_points - orgData.active_membership_threshold)} points above the minimum requirement!`);
    setChartText("Active Member");
    
  } else {
    setMemberText(`You have ${memberships.membership_points} total points. Earn ${
        (orgData.active_membership_threshold - memberships.membership_points)
        } more to become an active member this semester!`);
        progressToMember = memberships.membership_points/orgData.active_membership_threshold;
        setChartText(`${progressToMember}% to Active Membership`);
        console.log(chartText);
  }
    setLoading(false);
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
      
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>

      <h1>Your Membership with {orgData.org_name}</h1>

      <ResponsiveContainer width="50%" height={200}>
        <PieChart>
        
        	{ memberships.active_semesters < orgData.active_membership_threshold &&
            <text x='50%' y="50%" textAnchor="middle">
              % to Membership
            </text>
          }

          { memberships.active_semesters >= orgData.active_membership_threshold &&
            <text x='50%' y="50%" textAnchor="middle">
             Active Membership
            </text>
          }
        
        <Pie
        //  activeIndex={activeIndex}
        //  activeShape={renderActiveShape}
         dataKey="value"
         data={[
           { name: "Progress", value: memberships.membership_points },
           { name: "Completed", value: orgData.active_membership_threshold }
         ]}
         
         cx="50%"
         cy="50%"
         innerRadius={70}
         outerRadius={90}
        label="you're not there"
        > 
         <Cell fill="#D7D2CB" />
          <Cell fill="#009CBD" />
        
        </Pie>
        </PieChart>
      </ResponsiveContainer>


  <p>You have been an active member for <strong>{memberships.active_semesters}</strong> semesters.</p>

  {
    memberships.active_member == 'false' && 
    <p>You have ${memberships.membership_points} total points. <br/>Earn <strong>${
      orgData.active_membership_threshold - memberships.membership_points
      }</strong> more to become an active member this semester!</p>
  }

    {
    memberships.active_member == 'true' && 
    <p>Your total points this semester are <strong>{memberships.membership_points}</strong>! That is ${(memberships.membership_points - orgData.active_membership_threshold)} points above the minimum requirement!</p>
  }   
    
         {/* {memberText} */}
      {/* <p>Your total points this semester are {memberships.membership_points}!</p>
      <p>Earn {
        (orgData.active_membership_threshold - memberships.membership_points)
        } more to become an active member this semester!</p> */}
      {/* <p>Org Id: {bob.data.membership.active_semesters}</p> */}
      </div>
      <br />
      <h2>Computing Organization for Multicultural Students</h2>
      <p>Our mission is to build a supportive community that celebrates the talent of underrepresented students in Computing.
        We work to accomplish our mision by providing mentorship, mental health awareness, and leadership opportunities.
      </p>

    </PageSetup>
  );
}
