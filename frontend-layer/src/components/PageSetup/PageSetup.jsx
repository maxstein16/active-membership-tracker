import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";
import NavigationDropdown from "./NavigationDropdown";

export default function PageSetup({ children }) {

  // Handle showing and hiding of the dropdown
  const [isDropdownDown, setIsDropdownDown] = React.useState(false);
  const toggleDropdown = () => {
    setIsDropdownDown(!isDropdownDown);
  };

  return (
    <div className="page">
      <NavigationBar toggleDropdown={toggleDropdown} />
      { isDropdownDown ? <NavigationDropdown/> : <></>}

      <div className="page-content">{children}</div>
      <Footer />
    </div>
  );
}
