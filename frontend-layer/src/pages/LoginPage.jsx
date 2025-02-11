import * as React from "react";
import { Link } from "react-router";
import PageSetup from "../components/PageSetup/PageSetup";

export default function LoginPage() {
  return (
    <PageSetup>
      <h1>Login Page</h1>
      <Link to="/">Login</Link>
    </PageSetup>
  );
}
