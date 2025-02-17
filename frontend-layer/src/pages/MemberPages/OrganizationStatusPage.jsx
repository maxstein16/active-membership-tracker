import * as React from "react";
import { useParams } from "react-router-dom";
import PageSetup from "../../components/PageSetup/PageSetup";
import BackButton from "../../components/BackButton";

export default function OrganizationStatusPage() {
  const { orgId } = useParams();

  return (
    <PageSetup>
      <BackButton route={"/"} />

      <h1>Organization Status Page</h1>
      <p>Org Id: {orgId}</p>
      <br />
    </PageSetup>
  );
}
