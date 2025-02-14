import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";

import { useParams } from "react-router-dom";
import PageSetup from "../../components/PageSetup/PageSetup";
import BackButton from "../../components/BackButton";
import YearlyReport from "../../components/AdminPageComponents/YearlyReport";
import SemesterReport from "../../components/AdminPageComponents/SemesterReports";
import EventTable from "../../components/AdminPageComponents/EventTable";
import { CircularProgress } from "@mui/material";

export default function ReportsPage() {
  const { orgId } = useParams();
  const [orgInfo, setOrgInfo] = React.useState(undefined);

  React.useEffect(() => {
    // get the generic org info from the database with the orgId

    // set the orgInfo state variable
    // the data MUST BE FORMATTED AND LABELLED LIKE THIS
    setOrgInfo({
      name: "Computing Organization for Multicultural Students",
      abbreviation: "COMMs",
      color: "#20BDE4",
    });
  }, []);

  return (
    <PageSetup>
      <BackButton route={"/"} />

      {!orgInfo ? (
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
