import * as React from "react";
import { Link } from "react-router";
import PageSetup from "../components/PageSetup/PageSetup";

export default function DashboardPage() {
  return (
    <PageSetup>
      <h1>Dashboard Page</h1>

      <Link to="/profile">Profile</Link>
      <br />
      <br />
    </PageSetup>
  );
}
