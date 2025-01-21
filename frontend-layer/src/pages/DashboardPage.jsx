import * as React from "react";
import { Link } from "react-router";

export default function DashboardPage() {

  return (
    <div>
        <h1>Dashboard Page</h1>
        <Link to="/login">Login</Link><br/>
        <Link to="/profile">Profile</Link><br/>
        <Link to="/admin">Admin Page</Link><br/>
    </div>
  );
}
