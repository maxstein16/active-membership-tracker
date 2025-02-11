import * as React from "react";
import { Link } from "react-router";
import PageSetup from "../../components/PageSetup/PageSetup";

export default function AdminPage() {
  return (
    <PageSetup>
      <h1>Admin Page</h1>
      <Link to="/">Back to Dashboard</Link>
      <br />
    </PageSetup>
  );
}
