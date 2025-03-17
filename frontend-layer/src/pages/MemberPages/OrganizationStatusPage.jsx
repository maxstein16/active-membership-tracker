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
  let [progressToMember, setProgressToMember] = React.useState([]);
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
   
    //setProgressToMember(parseFloat(memberships.membership_points)/parseFloat(orgData.active_membership_threshold));
   
      console.log(result.data.memberships.membership_points);
      console.log(response.data.active_membership_threshold);
  
      console.log(memberships);
      console.log(orgData);
  
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
      
      <div style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    width: '100%',
    gap: '10%',
    marginLeft: '10%',
     marginRight: '10%'
}} >
<div>
      <h1>Your Membership with {orgData.org_name}</h1>
      
  <p>You have been an active member for <strong>{memberships.active_semesters}</strong> semesters.</p>
      <ResponsiveContainer width="50%" height={250}>
        <PieChart>
        
        	{ memberships.active_semesters < orgData.active_membership_threshold &&
            <text x='50%' y="50%" scaleToFit="true" textAnchor="middle" verticalAnchor="middle">
             {(parseInt(memberships.active_semesters) / parseInt(orgData.active_membership_threshold) * 100).toFixed(0)} %<br></br> to Active <br></br>Membership
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
         innerRadius={80}
         outerRadius={130}
        label="you're not there"
        > 
         <Cell fill="#D7D2CB" />
          <Cell fill="#009CBD" />
        
        </Pie>
        </PieChart>
      </ResponsiveContainer>

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
     
      <div style={{
      marginTop: '25%',
     marginBottom: '25%'
}} >
       
          <h2>{orgData.org_name}</h2>
          <p>{orgData.org_description} </p>
       
      </div>
      </div>
    </PageSetup>
  );
}
