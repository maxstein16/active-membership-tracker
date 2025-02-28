import * as React from "react";
import { Link } from "react-router";
import PageSetup from "../../components/PageSetup/PageSetup";
import BackButton from "../../components/BackButton";

export default function EditProfilePage() {
  return (
    <PageSetup>
      <BackButton route={"/profile"} />

      <h1>Edit Profile Page</h1>
      <Link to="/profile">Stop Editing</Link>
      <br />
    </PageSetup>
  );
}
