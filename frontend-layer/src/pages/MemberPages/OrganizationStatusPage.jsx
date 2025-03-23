import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";
import { useParams } from "react-router-dom";
import PageSetup from "../../components/PageSetup/PageSetup";
import BackButton from "../../components/BackButton";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import useWindowWidth from "../../utils/useWindowWidth";
import { getMemberData, getOrganizationData } from "../../utils/handleSettingsData";

export default function OrganizationStatusPage() {
  const { orgId } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [membershipInfo, setMemberships] = React.useState({
    membership_points: 0,
    active_member: false
  });
  const [memberInfo, setMemberInfo] = React.useState({
    activeSemesters: 1 
  });
  const [orgData, setOrgData] = React.useState({
    organization_abbreviation: '',
    organization_color: '#5bc0de',
    organization_description: '',
    organization_threshold: 0
  });
  const windowWidth = useWindowWidth();

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Since we don't have a proper way to get the current user ID, 
        // use a fixed ID for demo
        const memberId = 1; 
        
        const result = await getMemberData(orgId, memberId); 
        const response = await getOrganizationData(orgId);
        
        console.log("Member data:", result);
        console.log("Organization data:", response);
        
        setMemberships(result.membership);
        setMemberInfo(result);
        setOrgData(response);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [orgId]);
 
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
          
          <p>You have been an active member for <strong>{memberInfo.activeSemesters || 1}</strong> semesters.</p>
          
          <div style={{
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            maxWidth: "600px", 
            margin: "0 auto"
          }}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            {/* Text in the center of the pie chart */}
            {
              parseInt(membershipInfo.membership_points) >= parseInt(orgData.organization_threshold) ?
                <text x='50%' y="50%" textAnchor="middle" dominantBaseline="middle" style={{ fontWeight: "bold" }}>
                  <tspan x="50%" dy="-0.2em" fontSize="18" fill={orgData.organization_color}>Active</tspan>
                  <tspan x="50%" dy="1.4em" fontSize="18" fill={orgData.organization_color}>Membership</tspan>
                </text> 
              :
                <text x='50%' y="40%" textAnchor="middle" dominantBaseline="middle">
                  <tspan x="50%" fill={orgData.organization_color} fontSize="24" fontWeight="bold" dy=".6em">
                    {Math.min(100, Math.floor((parseInt(membershipInfo.membership_points) || 0) / 
                    (parseInt(orgData.organization_threshold) || 1) * 100))}%
                  </tspan>
                  <tspan x="50%" dy="1.2em">to Active</tspan>
                  <tspan x="50%" dy="1.2em">Membership</tspan>
                </text>
            }
              
            {/* The pie chart */}
            {parseInt(membershipInfo.membership_points) >= parseInt(orgData.organization_threshold) ? (
              <Pie
                data={[{ name: "Complete", value: 100 }]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="80%"
                fill={orgData.organization_color || "#5bc0de"}
                startAngle={0}
                endAngle={360}
                strokeWidth={0}
              />
            ) : (
              <Pie
                data={[
                  { 
                    name: "PointsEarned", 
                    value: Math.min(100, Math.floor((parseInt(membershipInfo.membership_points) || 0) / 
                      (parseInt(orgData.organization_threshold) || 1) * 100)) 
                  },
                  { 
                    name: "RemainingPoints", 
                    value: Math.max(0, 100 - Math.floor((parseInt(membershipInfo.membership_points) || 0) / 
                      (parseInt(orgData.organization_threshold) || 1) * 100))
                  }
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="80%"
                startAngle={90}
                endAngle={450}
                strokeWidth={0}  // Remove the line by setting strokeWidth to 0
              >
                <Cell key="cell-0" fill={orgData.organization_color || "#5bc0de"} />
                <Cell key="cell-1" fill="#d6d2dd" />
              </Pie>
            )}
          </PieChart>
        </ResponsiveContainer>
            
            <div style={{marginTop: "20px", textAlign: "center"}}>
              {
                parseInt(membershipInfo.membership_points) >= parseInt(orgData.organization_threshold) ?  
                <p>Your total points this semester are <strong>{membershipInfo.membership_points}</strong>! 
                That is <strong>{parseInt(membershipInfo.membership_points) - parseInt(orgData.organization_threshold)}</strong> points above the minimum requirement!</p>:
                <p>You have {membershipInfo.membership_points} total points. <br/>Earn <strong>{
                  parseInt(orgData.organization_threshold) - parseInt(membershipInfo.membership_points)
                }</strong> more points to become an active member this semester!</p> 
              }
            </div>
          </div>
        </div>
      </div>
    </PageSetup>
  );
}