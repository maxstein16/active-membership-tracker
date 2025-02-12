import * as React from "react";
import PageSetup from "../../components/PageSetup/PageSetup";
import BackButton from "../../components/BackButton";

export default function CreateOrganizationPage() {
  return (
    <PageSetup>
      <BackButton route={"/"} />

      <h1>Create Organization Page</h1>
      <br />
    </PageSetup>
  );
}
