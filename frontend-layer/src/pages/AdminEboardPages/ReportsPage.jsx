import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";

import { useParams } from "react-router-dom";
import PageSetup from "../../components/PageSetup/PageSetup";
import BackButton from "../../components/BackButton";
import YearlyReport from "../../components/AdminPageComponents/Reports/YearlyReport";
import SemesterReport from "../../components/AdminPageComponents/Reports/SemesterReports";
import EventTable from "../../components/AdminPageComponents/Reports/EventTable";
import { CircularProgress } from "@mui/material";
import { API_METHODS, getAPIData } from "../../utils/callAPI";
import displayErrors from "../../utils/displayErrors";

export default function ReportsPage() {
  const { orgId } = useParams();
  const [orgInfo, setOrgInfo] = React.useState(undefined);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    // get the generic org info from the database with the orgId
    getAPIData(`/organization/${orgId}`, API_METHODS.get, {}).then((response) => {
      if (!response || response.hasOwnProperty("error")) {
        setError(displayErrors.errorFetchingContactSupport)
        return;
      }
      setOrgInfo({
        name: response.data.organization_name,
        abbreviation: response.data.organization_abbreviation,
        color: response.data.organization_color,
      });
    })
    
  }, [orgId]);

  return (
    <PageSetup>
      <BackButton route={"/"} />


      {error !== "" ? <p>{error}</p> : !orgInfo ? (
        <CircularProgress/>
      ) : (
        <div className="reports-wrapper">
          <h1>{orgInfo.abbreviation} Reports</h1>

          <YearlyReport orgId={orgId} color={orgInfo.color}/>
          <hr/>
          <SemesterReport orgId={orgId} color={orgInfo.color}/>
          <hr/>
          <EventTable orgId={orgId} color={orgInfo.color}/>
        </div>
      )}
    </PageSetup>
  );
}
