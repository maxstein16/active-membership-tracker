import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";
import NavigationDropdown from "./NavigationDropdown";

export default function PageSetup({ children }) {

  // Handle showing and hiding of the dropdown
  const [isDropdownDown, setIsDropdownDown] = React.useState(false);
  const toggleDropdown = () => {
    setIsDropdownDown(!isDropdownDown);
  };

  const dropdownHeight = isDropdownDown ? 'auto' : 0;
  const dropdownOpacity = isDropdownDown ? 1 : 0;

  return (
    <div className="page">
      <NavigationBar toggleDropdown={toggleDropdown} />
      <div className="navigation-dropdown-wrapper" style={{height: dropdownHeight}} onClick={() => toggleDropdown()}>
        <NavigationDropdown opacity={dropdownOpacity}/>
      </div>

      <div className="page-content">{children}</div>
      <Footer />
    </div>
  );
}
