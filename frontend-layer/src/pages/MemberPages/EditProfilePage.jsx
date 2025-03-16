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
            gender:
              member.member_gender === "F"
                ? "Female"
                : member.member_gender === "M"
                ? "Male"
                : member.member_gender,
            status: member.member_status,
          };
          setUserData(formattedData);
          setOriginalData(formattedData); // Save original for change tracking
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{10,15}$/; // Supports international format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const genderOptions = ["F", "M"];
    const allowedTshirtSizes = ["XS", "S", "M", "L", "XL", "XXL"]; // Adjust if needed

    if (!name || typeof name !== "string")
      return "Name is required and must be a string.";
    if (!email || !emailRegex.test(email)) return "Invalid email format.";
    if (personalEmail && !emailRegex.test(personalEmail))
      return "Invalid personal email format.";
    if (phone && !phoneRegex.test(phone)) return "Invalid phone number format.";
    if (major && typeof major !== "string") return "Major must be a string.";
    if (graduationDate && !dateRegex.test(graduationDate))
      return "Graduation date must be in YYYY-MM-DD format.";
    if (race && typeof race !== "string") return "Race must be a string.";
    if (gender && !genderOptions.includes(gender))
      return "Gender must be 'F' or 'M'.";
    if (tshirt && !allowedTshirtSizes.includes(tshirt))
      return "Invalid T-shirt size.";
    if (status && typeof status !== "string") return "Status must be a string.";

    return null; // No errors
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
        label="T-Shirt Size"
        value={userData.tshirt}
        setValue={(value) => saveNewAttribute(value, "tshirt")}
        isMultiline={false}
      />
      <UserInput
        label="Race"
        value={userData.race}
        setValue={(value) => saveNewAttribute(value, "race")}
        isMultiline={false}
      />
      <UserInput
        label="Gender"
        value={userData.gender}
        setValue={(value) => saveNewAttribute(value, "gender")}
        isMultiline={false}
      />
      <UserInput
        label="Status"
        value={userData.status}
        setValue={(value) => saveNewAttribute(value, "status")}
        isMultiline={false}
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
