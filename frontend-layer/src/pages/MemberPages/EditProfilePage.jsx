import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";

import AreYouSure from "../../components/AreYouSure";
import PageSetup from "../../components/PageSetup/PageSetup";
import BackButton from "../../components/BackButton";
import UserInput from "../../components/UserInput";
import { CircularProgress } from "@mui/material";
import CustomSelect from "../../components/CustomSelect";
import { API_METHODS, getAPIData } from "../../utils/callAPI"; // Import getAPIData
import {
  genderOptions,
  allowedTshirtSizes,
  raceOptions,
  statusOptions,
} from "../../utils/allowedUserAttributes";

export default function EditProfilePage() {
  const [userData, setUserData] = React.useState(null);
  const [originalData, setOriginalData] = React.useState(null);
  const [navTarget, setNavTarget] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [unchangedMessage, setUnchangedMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [memberName, setMemberName] = React.useState("");
  const [memberEmail, setMemberEmail] = React.useState("");

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getAPIData("/member", API_METHODS.GET); // Use getAPIData instead of fetch

        if (data && data.data) {
          const member = data.data;
          const formattedData = {
            personalEmail: member.member_personal_email,
            phone: member.member_phone_number,
            major: member.member_major,
            graduationDate: new Date(member.member_graduation_date)
              .toISOString()
              .split("T")[0],
            race: member.member_race,
            tshirt: member.member_tshirt_size,
            gender: member.member_gender,
            status: member.member_status,
          };
          setUserData(formattedData);
          setOriginalData(formattedData); // Save original for change tracking
          setMemberName(member.member_name);
          setMemberEmail(member.member_email);
        } else {
          console.error(
            "Error fetching user data:",
            data?.error || "Unknown error"
          );
        }
      } catch (error) {
        console.error("Error:", error);
      }
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
    setUserData((prev) => ({ ...prev, [field]: newValue }));
  };

  const hasUnsavedChanges =
    JSON.stringify(userData) !== JSON.stringify(originalData);

  const handleNavigation = (target) => {
    if ((target === "/profile" || target === "cancel") && hasUnsavedChanges) {
      setNavTarget(target);
      setOpenDialog(true);
    } else {
      window.location.href = target;
    }
  };

  const handleSave = async () => {
    if (!hasUnsavedChanges) {
      setUnchangedMessage("Nothing to update.");
      setError("");
      setSuccessMessage("");
      return;
    }

    const validationError = validateFields();

    if (validationError) {
      setError(validationError);
      setUnchangedMessage("");
      setSuccessMessage("");
      return;
    }

    try {
      const payload = {
        member_personal_email: userData.personalEmail,
        member_phone_number: userData.phone,
        member_major: userData.major,
        member_graduation_date: userData.graduationDate,
        member_race: userData.race,
        member_gender: userData.gender,
        member_tshirt_size: userData.tshirt,
        member_status: userData.status,
      };

      const response = await getAPIData(`/member`, API_METHODS.put, payload);
      if (!response || response.error)
        throw new Error(response?.error || "Failed to save data");
      else {
        setSuccessMessage("Data saved successfully!");
        setError(""); // Clear any previous errors
        setUnchangedMessage("");
      }

      setOriginalData(userData);
      setError(""); // Clear any previous error
      setUnchangedMessage("");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!userData) return <CircularProgress />;

  return (
    <PageSetup>
      <BackButton
        route={"/profile"}
        onClick={() => handleNavigation("/profile")}
      />
      <h1>Edit Profile</h1>
      <h2>{`${memberName}, ${memberEmail}`}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {unchangedMessage && (
        <p style={{ color: "orange" }}>{unchangedMessage}</p>
      )}
      <UserInput
        label="Personal Email"
        value={userData.personalEmail}
        setValue={(value) => saveNewAttribute(value, "personalEmail")}
        isMultiline={false}
      />
      <UserInput
        label="Phone"
        value={userData.phone}
        setValue={(value) => saveNewAttribute(value, "phone")}
        isMultiline={false}
      />
      <UserInput
        label="Major"
        value={userData.major}
        setValue={(value) => saveNewAttribute(value, "major")}
        isMultiline={false}
      />
      <UserInput
        label="Graduation Date"
        value={userData.graduationDate}
        setValue={(value) => saveNewAttribute(value, "graduationDate")}
        isMultiline={false}
      />

      <CustomSelect
        label="T-shirt Size"
        options={["XS", "S", "M", "L", "XL", "XXL"]}
        startingValue={userData.tshirt}
        onSelect={(value) => saveNewAttribute(value, "tshirt")}
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
      />

      <CustomSelect
        label="Gender"
        options={["male", "female", "non-binary", "other", "prefer not to say"]}
        startingValue={userData.gender}
        onSelect={(value) => saveNewAttribute(value, "gender")}
      />

      <CustomSelect
        label="Status"
        options={["undergraduate", "graduate", "staff", "faculty", "alumni"]}
        startingValue={userData.status}
        onSelect={(value) => saveNewAttribute(value, "status")}
      />

      <button
        onClick={(e) => {
          e.preventDefault();
          handleNavigation("cancel");
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
        navLink={navTarget}
      />
    </PageSetup>
  );
}
