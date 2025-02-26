
import * as React from "react";
import PageSetup from "../../components/PageSetup/PageSetup";
import BackButton from "../../components/BackButton";

export default function GrantPrivilegePage() {
  return (
    <PageSetup>
      <BackButton route={"/"} />

      <h1>Grant Privilege Page</h1>
      <br />
    </PageSetup>
  );
}
