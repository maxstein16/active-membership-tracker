import * as React from "react";
import { useParams } from "react-router-dom";
import PageSetup from "../../components/PageSetup/PageSetup";

export default function SettingsPage() {

  const { orgId } = useParams();

  return (
    <PageSetup>
      <h1>Settings Page</h1>
      <p>Org Id: {orgId}</p>
      <br />
    </PageSetup>
  );
}