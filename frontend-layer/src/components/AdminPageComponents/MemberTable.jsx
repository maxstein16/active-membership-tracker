import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/adminPages.css";

export default function MemberTable() {
  
    // Store the members list as a state variable

    React.useEffect(() => {
        // Get API data and store it in the state variable above
    }, [])

  return (
    <div className="org-email-settings">
      <h2>Members</h2>
        {/* Display the members list in a MUI DataTable Component */}
    </div>
  );
}
