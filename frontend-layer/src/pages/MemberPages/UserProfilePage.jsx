import * as React from "react";
import { Link } from "react-router";
import PageSetup from "../../components/PageSetup/PageSetup";

export default function UserProfilePage() {
  return (
    <PageSetup>
      <h1>User Profile Page</h1>
      <Link to="/">Back to Dashboard</Link>
      <br />
      <Link to="./edit">Edit</Link>
      <br />
    </PageSetup>
  );
}
