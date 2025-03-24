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
          <i>
            Golisano College of Computing and Information Sciences Diversity
            Initiatives Office
          </i>
        </p>
        <p className="small-font">
          Created by the 7 Musketeers RIT Capstone Team &copy;{" "}
          {new Date().getFullYear()}
        </p>
      </div>
      <div>
        <h4>Learn more about us</h4>
        <a
          href="https://www.rit.edu/computing/diversity-initiatives-and-access"
          target="_blank"
          rel="noreferrer"
        >
          RIT GCCIS DIO
        </a>
        {/* 
        I DO NOT KNOW WHY IT DOESN'T SCROLL BUT IT DOESN'T !!!???
        <p
          onClick={() => {
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }}
          style={{ textDecoration: "underline" }}
        >
          Go Back to Top
        </p> */}
      </div>
    </div>
  );
}
