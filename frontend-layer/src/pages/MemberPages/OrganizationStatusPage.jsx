import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";
import { useParams } from "react-router-dom";
import PageSetup from "../../components/PageSetup/PageSetup";
import BackButton from "../../components/BackButton";
import { API_METHODS, getAPIData } from "../../utils/callAPI";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import useWindowWidth from "../../utils/useWindowWidth";

export default function OrganizationStatusPage() {
  const { orgId } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [membershipInfo, setMemberships] = React.useState([]);
  const [memberInfo, setMemberInfo] = React.useState([]);
  const [orgData, setOrgData] = React.useState([]);

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        const result = await getAPIData(`/organization/${orgId}/member/1`, API_METHODS.get, {}); 
        const response = await getAPIData(`/organization/${orgId}`, API_METHODS.get, {});
        
        setMemberships(result.data.membership);
        setMemberInfo(result.data);
        setOrgData(response.data);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [orgId]);

  const windowWidth = useWindowWidth();
 
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <PageSetup>
      <BackButton route={"/"} />

      <div className={ windowWidth > 499 ? "member-progress-chart-page" : "member-progress-chart-page-mobile"} 
           style={{ 
             display: "flex", 
             justifyContent: "center", 
             alignItems: "center", 
             minHeight: "calc(100vh - 100px)"
           }}>
        <div style={{
          textAlign: "center", 
          maxWidth: "800px", 
          margin: "0 auto",
          width: "100%"
        }}>
          <h1>Your Membership with <span style={{color: orgData.organization_color}}>{orgData.organization_abbreviation}</span></h1>
          
          <p style={{marginBottom: "20px"}}>{orgData.organization_description}</p>
          
          <p>You have been an active member for <strong>{memberInfo.activeSemesters} </strong> semesters.</p>
          
          <div style={{
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            maxWidth: "600px", 
            margin: "0 auto"
          }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
              {
                membershipInfo.membership_points >= orgData.organization_threshold &&
                  <text x='50%' y="50%" scaleToFit="true" textAnchor="middle" verticalAnchor="middle" textLength={160}>
                    <tspan x="50%" dy=".6em" fill={orgData.organization_color}>Active</tspan>
                    <tspan x="50%" dy="1.2em" fill={orgData.organization_color}>Membership</tspan>
                  </text> 
              }
              {
                membershipInfo.membership_points < orgData.organization_threshold &&
                <text x='50%' y="40%" scaleToFit="true" textAnchor="middle" verticalAnchor="middle" textLength={160}>
                  <tspan x="50%" fill={orgData.organization_color} dy=".6em">{(parseInt(membershipInfo.membership_points) / parseInt(orgData.organization_threshold) * 100).toFixed(0)} %</tspan>
                  <tspan x="50%" dy="1.2em">to Active</tspan>
                  <tspan x="50%" dy="1.2em">Membership</tspan>
                </text>
              }
                
              <Pie
                data={[
                  { name: "PointsEarned", value: membershipInfo.membership_points },
                  { name: "RemainingPoints", value: orgData.organization_threshold - membershipInfo.membership_points }
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="80%"
                startAngle={90}
                endAngle={-270}
              > 
                <Cell key="cell-0" fill={orgData.organization_color || "#5bc0de"} />
                <Cell key="cell-1" fill="#d6d2dd" />
              </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            <div style={{marginTop: "20px", textAlign: "center"}}>
              {
                membershipInfo.active_member ?  
                <p>Your total points this semester are <strong>{membershipInfo.membership_points}</strong>! 
                That is {(membershipInfo.membership_points - orgData.organization_threshold)} points above the minimum requirement!</p>:
                <p>You have {membershipInfo.membership_points} total points. <br/>Earn <strong>{
                  orgData.organization_threshold - membershipInfo.membership_points
                }</strong> more to become an active member this semester!</p> 
              }
            </div>
          </div>
        </div>
      </div>
    </PageSetup>
  );
}