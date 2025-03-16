import * as React from "react";
import { useParams } from "react-router-dom";
import PageSetup from "../../components/PageSetup/PageSetup";
import BackButton from "../../components/BackButton";
import { API_METHODS, getAPIData } from "../../utils/callAPI";

export default function OrganizationStatusPage() {
  const { orgId } = useParams();
  var lot = useParams();
  //var th = getAPIData("/organization", API_METHODS.get);
  //console.log(th);
 let bob = async () => {
    
    const result = await getAPIData("/organization/1", API_METHODS.get, {});

    if (!result) {
      return;
    }

    if (result.status === "success") {
      console.log(result);
      return;
    }
  };

 


  return (
    <PageSetup>
      <BackButton route={"/"} />
      {console.log(lot.orgId)}
    {bob}

      <h1>Organization Status Page</h1>
      <h1>Your Membership with WiC</h1>
      <p>You have been an active member for # semesters</p>

      <p>You have earned # total points.</p>
      <p>Earn # more to become an active member this semester!</p>
      <p>Org Id: {lot.orgId}</p>
      <br />
      <h2>Computing Organization for Multicultural Students</h2>
      <p>Our mission is to build a supportive community that celebrates the talent of underrepresented students in Computing.
        We work to accomplish our mision by providing mentorship, mental health awareness, and leadership opportunities.
      </p>

    </PageSetup>
  );
}
