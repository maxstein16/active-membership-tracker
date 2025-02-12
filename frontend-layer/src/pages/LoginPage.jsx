import * as React from "react";
import "../assets/css/constants.css";
import "../assets/css/general.css";
import PageSetup from "../components/PageSetup/PageSetup";
import { API_METHODS, getAPIData } from "../utils/callAPI";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = React.useState("");

  const login = async () => {
    setErrMsg("");
    const result = await getAPIData("/session/login", API_METHODS.get, {});

    if (!result) {
      setErrMsg("Could not log you in");
      return;
    }

    if (result.status === "success") {
      navigate("/")
    }
  };

  return (
    <PageSetup>
      <h1>Login Page</h1>
      <button onClick={login}>Login</button>
      <p>{errMsg}</p>
    </PageSetup>
  );
}
