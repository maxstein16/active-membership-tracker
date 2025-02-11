import * as React from "react";
import { useParams } from "react-router-dom";
import PageSetup from "../../components/PageSetup/PageSetup";

export default function ReportsPage() {

  const { orgId } = useParams();

  return (
    <PageSetup>
      <h1>Reports Page</h1>
      <p>Org Id: {orgId}</p>
      <br />
    </PageSetup>
  );
}