import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import UserInput from "../UserInput.jsx";
import AreYouSure from "../AreYouSure.jsx";
import CustomSelect from "../CustomSelect.jsx";
import {
  getAllMembers,
  getMembersInOrg,
  manuallyAddAttendanceToDB,
} from "../../utils/eventsCalls.js";

export default function ManualAddAttendanceDialog({ orgId, color, event }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showAreYouSureDialog, setShowAreYouSureDialog] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const [findMembersInsideOrg, setFindMembersInsideOrg] = React.useState(true);
  const [memberList, setMemberList] = React.useState([]);
  const [memberDetailList, setMemberDetailList] = React.useState([]);
  const [member, setMember] = React.useState("");
  const [points, setPoints] = React.useState("1");

  React.useEffect(() => {
    getMembersInOrg(orgId).then((response) => {
      setMemberDetailList(response);
      let nameList = [];
      response.forEach((member) => {
        nameList.push(member.member);
      });
      setMemberList(nameList);
      setLoading(false);
    });
  }, [orgId]);

  const switchMemberList = () => {
    setLoading(true);
    if (findMembersInsideOrg) {
      setFindMembersInsideOrg(false);
      // find members outside org (because they just asked to switch this)
      getAllMembers().then((response) => {
        setMemberDetailList(response);
        let nameList = [];
        response.forEach((member) => {
          nameList.push(member.member);
        });
        setMemberList(nameList);
        setLoading(false);
      });
    } else {
      setFindMembersInsideOrg(true);
      // find members inside org (because they just asked to switch this)
      getMembersInOrg(orgId).then((response) => {
        setMemberDetailList(response);
        let nameList = [];
        response.forEach((member) => {
          nameList.push(member.member);
        });
        setMemberList(nameList);
        setLoading(false);
      });
    }
  };

  const addAttendance = () => {
    if (error !== "" && error !== "Error saving data") {
      return;
    }

    let details = memberDetailList.filter((mem) => mem.member === member)
    let memberId = details[0].id;
    // call api
    manuallyAddAttendanceToDB(orgId, event.event_id, memberId, points).then(
      (result) => {
        if (!result) {
          setError("Error saving data");
        } else {
          window.location.reload();
        }
      }
    );
  };

  return (
    <div>
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        style={{ color: color, borderColor: color }}
        className="secondary custom-color-button"
      >
        Manually add Attendance
      </button>
      <Dialog
        onClose={() => {
          setIsOpen(false);
        }}
        open={isOpen}
      >
        <DialogTitle>Add Attendance</DialogTitle>
        {loading ? (
          <DialogContent>
            <CircularProgress />
          </DialogContent>
        ) : (
          <>
            <DialogContent>
              <p>
                Can't find the member you are looking for?{" "}
                <span
                  style={{ textDecoration: "underline", fontWeight: 'bold', color: color }}
                  onClick={switchMemberList}
                >
                  {findMembersInsideOrg
                    ? "Show members outside my organization"
                    : "Show members just inside my organization"}
                </span>
              </p>
              {error !== "" ? <p className="error">{error}</p> : <></>}

              {/* Member Select */}
              <CustomSelect
                label="Member"
                color={color}
                options={memberList}
                startingValue={member}
                onSelect={(value) => {
                  setMember(value);
                }}
              />
              {/* Points */}
              <UserInput
                label="Points"
                color={color}
                value={points}
                setValue={setPoints}
                isMultiline={false}
                onLeaveField={(newValue) => {
                  if (newValue.trim() === "") {
                    setError("Points must have a value");
                    return;
                  } else if (isNaN(newValue)) {
                    setError("Points must be a number");
                    return;
                  }
                  setError("");
                }}
              />
            </DialogContent>
            <DialogActions>
              <button
                onClick={() => {
                  setShowAreYouSureDialog(true);
                }}
                className="secondary custom-color-button"
                style={{ color: color, borderColor: color }}
              >
                Cancel
              </button>
              <button
                onClick={addAttendance}
                className="custom-color-button"
                style={{ backgroundColor: color, borderColor: color }}
              >
                Create
              </button>
              <AreYouSure
                open={showAreYouSureDialog}
                setOpen={setShowAreYouSureDialog}
                funcInsteadOfNavLink={() => {
                  setIsOpen(false);
                }}
              />
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}
