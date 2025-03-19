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
  let [posts, setPosts] = React.useState([]);
  let [loading, setLoading] = React.useState(false);
  let [memberships, setMemberships] = React.useState([]);
  let [orgData, setOrgData] = React.useState([]);
  let [data, setData] = React.useState([]);

 React.useEffect(() => {
 
  let loadPost = async () => {
    setLoading(true);
    //get member to get member id who is logged in (did that)
    const currentUserMemberID = await getAPIData(`/member`, API_METHODS.get, {});

    //slide that into the below call
   // const result = await getAPIData(`/organization/${orgId}/member/${currentUserMemberID.data.member_id}`, API_METHODS.get, {});
   const result = await getAPIData(`/organization/${orgId}/member/1`, API_METHODS.get, {}); 
   setPosts(result.data);

   setMemberships(result.data.membership);
   console.log(result.data);

    const response = await getAPIData(
      `/organization/${orgId}`,
      API_METHODS.get,
      {}
    );
    
      setOrgData(response.data);

    console.log(result.data.membership);
    console.log(result.data.membership.membership_points);
       console.log(response.data);
  console.log(response.data.organization_color);
      let data = [
        {name: 'completed', value: orgData.organization_threshold},
        {name: 'progress', value: memberships.membership_points}
  
      ];
  
      setData(data);
    
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
          <h1>Your Membership with <span style={{color: orgData.organization_color}}>{orgData.organization_abbreviation}</span></h1>
          
          <p>You have been an active member for <strong>{memberships.active_semesters}</strong> semesters.</p>
          <ResponsiveContainer width="100%" height="50%">
            <PieChart>
            
                <text x='50%' y="40%" scaleToFit="true" textAnchor="middle" verticalAnchor="middle" textLength={160}>
                <tspan x="50%" fill={orgData.organization_color} dy=".6em">  {(parseInt(memberships.membership_points) / parseInt(orgData.organization_threshold) * 100).toFixed(0)} %</tspan>
                <tspan x="50%" dy="1.2em">to Active</tspan>
                <tspan x="50%" dy="1.2em">Membership</tspan>
                </text>
              
           
                {/* <text x='50%' y="50%" scaleToFit="true" textAnchor="middle" verticalAnchor="middle" textLength={160}>
                  <tspan x="50%" dy=".6em">Active</tspan>
                  <tspan x="50%" dy="1.2em">Membership</tspan>
                </text> */}
              
            
              <Pie
                dataKey="value"
                data={[
                  { name: "Progress", value: memberships.membership_points },
                  { name: "Completed", value: orgData.organization_threshold }
                ]}
                
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="80%"
                fill="#8884d8"
                label
              > 
              {
                orgId === 1 &&
                <><Cell key="data" fill={orgData.organization_color} /><Cell fill='#7747a6' /></>
              }
              
              {
                orgId === 2 &&
                <><Cell key="active" fill="#476da6" /><Cell fill={orgData.organization_color} /></>
              }

            </Pie>
            </PieChart>
          </ResponsiveContainer>

          {
            memberships.active_member ?  <p>Your total points this semester are <strong>{memberships.membership_points}</strong>! 
            That is ${(memberships.membership_points - orgData.organization_threshold)} points above the minimum requirement!</p>:
            <p>You have {memberships.membership_points} total points. <br/>Earn <strong>{
              orgData.organization_threshold - memberships.membership_points
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
