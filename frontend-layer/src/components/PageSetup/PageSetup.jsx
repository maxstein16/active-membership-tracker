import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";

export default function PageSetup({children}) {

  return (
    <div>
        <NavigationBar/>
        { children }
        <Footer/>
    </div>
  );
}
