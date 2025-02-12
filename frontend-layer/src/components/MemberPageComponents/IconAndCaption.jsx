import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";

export default function IconAndCaption({ caption, children }) {
  return (
    <div className="icon-and-caption">
        {children}
        <p>{caption}</p>
    </div>
  );
}
