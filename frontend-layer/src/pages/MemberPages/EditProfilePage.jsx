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

export default function EditProfilePage() {
  const [userData, setUserData] = React.useState(null);
  const [originalData, setOriginalData] = React.useState(null);
  const [navTarget, setNavTarget] = React.useState("");
  const [error, setError] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/v1/member", {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        const data = await response.json();
        if (response.status === 200) {
          const member = data.data;
          const formattedData = {
            name: member.member_name,
            email: member.member_email,
            personalEmail: member.member_personal_email,
            phone: member.member_phone_number,
            major: member.member_major,
            graduationDate: member.member_graduation_date, // Store full date
            tshirt: member.member_tshirt_size,
            race: member.member_race,
            gender: member.member_gender,
            status: member.member_status,
          };
          setUserData(formattedData);
          setOriginalData(formattedData); // Save original for change tracking

          console.log(
            "fetched data looks like this" + member.member_name,
            member.member_email,
            member.member_personal_email,
            member.member_phone_number,
            member.member_major,
            member.member_graduation_date,
            member.member_tshirt_size,
            member.member_race,
            member.member_gender,
            member.member_status
          );
        } else {
          console.error("Error fetching user data:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUserData();
  }, []);

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

  const validateFields = () => {
    const {
      name,
      email,
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
    const emailRegex = /^[a-zA-Z0-9._%+-]+@rit\.edu$/;
    const personalEmailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // General email format
    const phoneRegex = /^\+?(\d[\d-.()\s]*){10,15}$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format

    // Enum options (you can update these as needed)
    const genderOptions = [
      "Male",
      "Female",
      "Non-binary",
      "Other",
      "Prefer not to say",
    ];
    const allowedTshirtSizes = [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "Other",
      "Prefer not to say",
    ];
    const raceOptions = [
      "Asian",
      "Black or African American",
      "Caucasian / White",
      "Hispanic or Latino",
      "Native American or Alaska Native",
      "Native Hawaiian or Other Pacific Islander",
      "Middle Eastern or North African",
      "Mixed / Two or More Races",
      "Other",
      "Prefer Not to Say",
    ];
    const statusOptions = [
      "undergraduate",
      "graduate",
      "staff",
      "faculty",
      "alumni",
    ];

    // Name validation
    if (!name || typeof name !== "string")
      return "Name is required and must be a string.";

    // Email validation (RIT email)
    if (!email || !emailRegex.test(email))
      return "Invalid email format. It must end with 'rit.edu'.";

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

  // Capitalize the first letter of each word for display
  const capitalizeFirstLetter = (str) => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleSave = async () => {
    const validationError = validateFields();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const payload = {
        member_name: userData.name,
        member_email: userData.email,
        member_personal_email: userData.personalEmail,
        member_phone_number: userData.phone,
        member_major: userData.major,
        member_graduation_date: userData.graduationDate,
        member_race: userData.race,
        member_gender: userData.gender,
        member_tshirt_size: userData.tshirt,
        member_status: userData.status,
      };

      const response = await fetch("/v1/member", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save data");

      setOriginalData(userData);
      setError(""); // Clear any previous error
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
      {error && <p className="error">{error}</p>}

      <UserInput
        label="Name"
        value={userData.name}
        setValue={(value) => saveNewAttribute(value, "name")}
        isMultiline={false}
      />
      <UserInput
        label="Email"
        value={userData.email}
        setValue={(value) => saveNewAttribute(value, "email")}
        isMultiline={false}
      />
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
      <UserInput
        label="T-shirt Size"
        value={userData.tshirt}
        setValue={(value) => saveNewAttribute(value, "tshirt")}
        isDropdown={true}
        options={["XS", "S", "M", "L", "XL", "XXL"]}
      />

      <UserInput
        label="Race"
        value={userData.race}
        setValue={(value) => saveNewAttribute(value, "race")}
        isDropdown={true}
        options={[
          "Asian",
          "Black or African American",
          "Caucasian / White",
          "Hispanic or Latino",
          "Native American or Alaska Native",
          "Native Hawaiian or Other Pacific Islander",
          "Middle Eastern or North African",
          "Mixed / Two or More Races",
          "Other",
          "Prefer Not to Say",
        ]}
      />

      <UserInput
        label="Gender"
        value={userData.gender}
        setValue={(value) => saveNewAttribute(value, "gender")}
        isDropdown={true}
        options={["Male", "Female", "Non-binary", "Other", "Prefer not to say"]}
      />

      <UserInput
        label="Status"
        value={capitalizeFirstLetter(userData.status)}
        setValue={(value) => saveNewAttribute(value.toLowerCase(), "status")}
        isDropdown={true}
        options={["Undergraduate", "Graduate", "Staff", "Faculty", "Alumni"]}
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
