import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";

import AreYouSure from "../../components/AreYouSure";
import PageSetup from "../../components/PageSetup/PageSetup";
import BackButton from "../../components/BackButton";
import UserInput from "../../components/UserInput";
import { CircularProgress, Snackbar } from "@mui/material";
import CustomSelect from "../../components/CustomSelect";
import { API_METHODS, getAPIData } from "../../utils/callAPI"; // Import getAPIData
import { useNavigate } from "react-router-dom";

import {
  genderOptions,
  allowedTshirtSizes,
  raceOptions,
  statusOptions,
} from "../../utils/allowedUserAttributes";
import displayErrors from "../../utils/displayErrors";

export default function EditProfilePage() {
    const navigate = useNavigate();
  
  const [breakingError, setBreakingError] = React.useState("");
  const [userData, setUserData] = React.useState(null);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);
  const [memberName, setMemberName] = React.useState("");
  const [memberEmail, setMemberEmail] = React.useState("");
  const [hasChanges, setHasChanges] = React.useState(false);

  React.useEffect(() => {
    const fetchUserData = async () => {
      setBreakingError("");
      const data = await getAPIData("/member", API_METHODS.get, {}); // Use getAPIData instead of fetch

      if (!data || !data.hasOwnProperty("data")) {
        console.error("Error fetching user data:", data);
        setBreakingError(displayErrors.errorFetchingContactSupport);
        return;
      }

      const member = data.data;
      const formattedData = {
        personalEmail: member.member_personal_email ?? "",
        phone: member.member_phone_number ?? "",
        major: member.member_major ?? "",
        graduationDate: new Date(
          member.member_graduation_date ??
            `${new Date().getFullYear()}-05-10 00:00:00`
        )
          .toISOString()
          .split("T")[0],
        race: member.member_race ?? "",
        tshirt: member.member_tshirt_size ?? "",
        gender: member.member_gender ?? "",
        status: member.member_status ?? "",
      };

      setUserData(formattedData);
      setMemberName(member.member_name);
      setMemberEmail(member.member_email);
    };

    fetchUserData();
  }, []);

  const validateFields = () => {
    const {
      personalEmail,
      phone,
      major,
      graduationDate,
      race,
      gender,
      tshirt,
      status,
    } = userData;

    // Regular expressions for validation
    const personalEmailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // General email format
    const phoneRegex = /^\+?(\d[\d-.()\s]*){10,15}$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format

    // Personal email validation (if provided)
    if (personalEmail && !personalEmailRegex.test(personalEmail))
      return "Invalid personal email format.";

    // Phone validation (if provided)
    if (phone && !phoneRegex.test(phone)) return "Invalid phone number format.";

    // Major validation (optional)
    if (major && typeof major !== "string") return "Major must be a string.";

    // Graduation date validation (optional)
    if (graduationDate && !dateRegex.test(graduationDate))
      return "Graduation date must be in YYYY-MM-DD format.";

    // Race validation (optional, check if provided value is in the enum)
    if (race && !raceOptions.includes(race)) return "Invalid race selected.";

    // Gender validation (optional, check if provided value is in the enum)
    if (gender && !genderOptions.includes(gender))
      return "Gender must be one of the following: 'Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'.";

    // T-shirt size validation (optional, check if provided value is in the enum)
    if (tshirt && !allowedTshirtSizes.includes(tshirt))
      return "Invalid T-shirt size. Please choose from the listed sizes.";

    // Status validation (optional, check if provided value is in the enum)
    if (status && !statusOptions.includes(status))
      return "Status must be one of the following: 'Undergraduate', 'Graduate', 'Staff', 'Faculty', 'Alumni'.";

    return null; // No errors
  };

  const saveNewAttribute = (newValue, field) => {
    setHasChanges(true)    
    setUserData((prev) => ({ ...prev, [field]: newValue }));
  };

  const handleSave = async () => {

    // clear any pre-existing messages
    setError(""); 
    setSuccessMessage("");

    const validationError = validateFields();

    if (validationError) {
      setError(validationError); 
      setSuccessMessage("");
      return;
    }

    const payload = {
      personal_email: userData.personalEmail,
      phone_number: userData.phone,
      major: userData.major,
      graduation_date: userData.graduationDate,
      race: userData.race,
      gender: userData.gender,
      tshirt_size: userData.tshirt,
      status: userData.status,
    };

    const response = await getAPIData(`/member`, API_METHODS.put, payload);

    if (response && response.error && response.error === "Nothing Updated") {
      setIsSuccessOpen(true);
      setSuccessMessage("Nothing to update.");
      setError(""); // Clear any previous errors
      return;
    }

    if (!response || response.error) {
      setError("Error saving your data");
      return;
    }

    setIsSuccessOpen(true);
    setSuccessMessage("Data saved successfully!");
    setError(""); // Clear any previous errors
    setHasChanges(false)
  };

  if (breakingError !== "")
    return (
      <PageSetup>
        <BackButton route={"/profile"} />
        <p>{breakingError}</p>
      </PageSetup>
    );
  if (!userData)
    return (
      <PageSetup>
        <BackButton route={"/profile"} />
        <CircularProgress />
      </PageSetup>
    );

  return (
    <PageSetup>
      <BackButton
        areYouSure={() => {
          if (hasChanges) {
            setOpenDialog(true);
          } else {
            navigate("/profile")
          }
        }}
      />
      <h1>Edit Profile</h1>
      <h2 style={{ fontWeight: "normal", color: "var(--orange)" }}>
        {memberName}
      </h2>
      <p style={{ color: "var(--orange)" }}>{memberEmail}</p>

      {error !== "" ? <p style={{ color: "red" }}>{error}</p> : <></>}
      {successMessage !== "" ? <p style={{ color: "green" }}>{successMessage}</p> : <></>}
      <UserInput
        label="Personal Email"
        value={userData.personalEmail}
        setValue={(value) => saveNewAttribute(value, "personalEmail")}
        isMultiline={false}
        color={"orange"}
        onLeaveField={() => {
          /* Nothing to do here */
        }}
      />
      <UserInput
        label="Phone"
        value={userData.phone}
        setValue={(value) => saveNewAttribute(value, "phone")}
        isMultiline={false}
        color={"orange"}
        onLeaveField={() => {
          /* Nothing to do here */
        }}
      />
      <UserInput
        label="Major"
        value={userData.major}
        setValue={(value) => saveNewAttribute(value, "major")}
        isMultiline={false}
        color={"orange"}
        onLeaveField={() => {
          /* Nothing to do here */
        }}
      />
      <UserInput
        label="Graduation Date"
        value={userData.graduationDate}
        setValue={(value) => saveNewAttribute(value, "graduationDate")}
        isMultiline={false}
        color={"orange"}
        onLeaveField={() => {
          /* Nothing to do here */
        }}
      />

      <CustomSelect
        label="T-shirt Size"
        options={["XS", "S", "M", "L", "XL", "XXL"]}
        startingValue={userData.tshirt}
        onSelect={(value) => saveNewAttribute(value, "tshirt")}
        color={"orange"}
      />

      <CustomSelect
        label="Race"
        options={[
          "asian",
          "black",
          "white",
          "hispanic",
          "indigenous",
          "pacific islander",
          "middle eastern / north african",
          "multiracial",
          "other",
          "prefer not to say",
        ]}
        startingValue={userData.race}
        onSelect={(value) => saveNewAttribute(value, "race")}
        color={"orange"}
      />

      <CustomSelect
        label="Gender"
        options={["male", "female", "non-binary", "other", "prefer not to say"]}
        startingValue={userData.gender}
        onSelect={(value) => saveNewAttribute(value, "gender")}
        color={"orange"}
      />

      <CustomSelect
        label="Status"
        options={["undergraduate", "graduate", "staff", "faculty", "alumni"]}
        startingValue={userData.status}
        onSelect={(value) => saveNewAttribute(value, "status")}
        color={"orange"}
      />

      <button
        onClick={(e) => {
          e.preventDefault();
          setOpenDialog(true);
        }}
        className="secondary"
      >
        Cancel
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="primary"
      >
        Save
      </button>

      <AreYouSure
        open={openDialog}
        setOpen={setOpenDialog}
        navLink={"/profile"}
      />
      <Snackbar
        open={isSuccessOpen}
        autoHideDuration={5000}
        onClose={() => {
          setIsSuccessOpen(false);
        }}
        message={successMessage}
      />
    </PageSetup>
  );
}
