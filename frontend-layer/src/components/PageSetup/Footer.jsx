import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";

export default function Footer() {
  return (
    <div className="footer">
      <div>
        <h3>RIT | Active Membership Tracker</h3>
        <p>
          <i>Diversity Initiatives Office</i>
        </p>
        <p className="small-font">
          Created by the 7 Musketeers RIT Capstone Team &copy; 2025
        </p>
      </div>
      <div>
        <h4>Learn more about us</h4>
        <a href="https://www.rit.edu/diversity/" target="_blank" rel="noreferrer">RIT DIO</a>
      </div>
    </div>
  );
}
