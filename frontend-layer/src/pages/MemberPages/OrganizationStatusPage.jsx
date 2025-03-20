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
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import useWindowWidth from "../../utils/useWindowWidth";


export default function OrganizationStatusPage() {
  const { orgId } = useParams();
  let [loading, setLoading] = React.useState(false);
  let [posts, setPosts] = React.useState([]);
  var [membershipInfo, setMemberships] = React.useState([]);
  var [memberInfo, setMemberInfo] = React.useState([]);
  var [orgData, setOrgData] = React.useState([]);
  let [graphData, setGraphData] = React.useState([]);

 React.useEffect(() => {
 
  let loadPost = async () => {
    setLoading(true);
    //get member to get member id who is logged in (did that)
    const currentUserMemberID = await getAPIData(`/member`, API_METHODS.get, {});

    //slide that into the below call
   // const result = await getAPIData(`/organization/${orgId}/member/${currentUserMemberID.data.member_id}`, API_METHODS.get, {});
   const result = await getAPIData(`/organization/${orgId}/member/1`, API_METHODS.get, {}); 
   setPosts(result.data);
   const response = await getAPIData(
      `/organization/${orgId}`,
      API_METHODS.get,
      {}
    );
      setMemberships(result.data.membership);
      setOrgData(response.data);
      
      setMemberInfo(result.data);
     
        // console.log(result.data);
        // console.log(response.data.organization_threshold);
      
    
      setLoading(false);
    

  };
  loadPost();

 }, []);

  const windowWidth = useWindowWidth();
 
  return (
    <PageSetup>
      <BackButton route={"/"} />

      <div className={ windowWidth > 499 ? "member-progress-chart-page" : "member-progress-chart-page-mobile"}>
        <div>
          <h1>Your Membership with {orgData.organization_abbreviation}</h1>
          {
            console.log(orgData)
          }
          {console.log(membershipInfo)
          }

          {console.log(memberInfo)}
          <p>You have been an active member for <strong>{memberInfo.activeSemesters} </strong> semesters.</p>
          <ResponsiveContainer width="100%" height="50%">
            <PieChart>
            
            {
              membershipInfo.membership_points >= orgData.organization_threshold &&

                <text x='50%' y="50%" scaleToFit="true" textAnchor="middle" verticalAnchor="middle" textLength={160}>
                  <tspan x="50%" dy=".6em">Active</tspan>
                  <tspan x="50%" dy="1.2em">Membership</tspan>
                </text> 
            }
            {
               membershipInfo.membership_points < orgData.organization_threshold &&
               <text x='50%' y="40%" scaleToFit="true" textAnchor="middle" verticalAnchor="middle" textLength={160}>
               <tspan x="50%" dy=".6em">  {(parseInt(membershipInfo.membership_points) / parseInt(orgData.organization_threshold) * 100).toFixed(0)} %</tspan>
               <tspan x="50%" dy="1.2em">to Active</tspan>
               <tspan x="50%" dy="1.2em">Membership</tspan>
               </text>

            }
               
              
              <Pie
                data={[
                  { name: "PointsEarned", value: membershipInfo.membership_points },
                  { name: "TotalPoints", value: orgData.organization_threshold }
                ]}

                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="80%"
                //fill="#d6d2dd"
              > 
             
                {/* <Cell fill={orgData.organization_color} /><Cell/>  <- this uses the organization's color on the pie chart but it looks weird with certain values*/}
              <Cell></Cell>
            </Pie>
            </PieChart>
          </ResponsiveContainer>

          {
            membershipInfo.active_member ?  <p>Your total points this semester are <strong>{membershipInfo.membership_points}</strong>! 
            That is ${(membershipInfo.membership_points - orgData.organization_threshold)} points above the minimum requirement!</p>:
            <p>You have {membershipInfo.membership_points} total points. <br/>Earn <strong>{
              orgData.organization_threshold - membershipInfo.membership_points
              }</strong> more to become an active member this semester!</p> 
          }

          </div>
      
        <div style={{marginTop: '25%', marginBottom: '25%'}} >
            <h2>{orgData.organization_name}</h2>
            <p>{orgData.organization_description} </p>
        </div>
      </div>
    </PageSetup>
  );
}
