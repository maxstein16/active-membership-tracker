import * as React from "react";
import { Link } from "react-router";

export default function UserProfilePage() {

  return (
    <div>
        <h1>User Profile Page</h1>
        <Link to="/">Back to Dashboard</Link><br/>
        <Link to="./edit">Edit</Link><br/>
    </div>
  );
}
