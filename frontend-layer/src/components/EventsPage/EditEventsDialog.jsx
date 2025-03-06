import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import UserInput from "../UserInput.jsx";
import DatePicker from "../DatePicker.jsx";
import moment from "moment";
import AreYouSure from "../AreYouSure.jsx";
import CustomSelect from "../CustomSelect.jsx";
import { createNewEvent, updateEventSetting } from "../../utils/eventsCalls.js";

export default function EditEventsDialog({ isEdit, orgId, color, event }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [error, setError] = React.useState("");
  const [name, setName] = React.useState(event?.event_name || "");
  const [desc, setDesc] = React.useState(event?.event_description || "");
  const [location, setLocation] = React.useState(event?.event_location || "");
  const [type, setType] = React.useState(
    event && event.event_type !== "general_meeting"
      ? event.event_type
      : "general meeting"
  );
  const [start, setStart] = React.useState(
    moment(event?.event_start || moment())
  );
  const [end, setEnd] = React.useState(moment(event?.event_end || moment()));
  const [showAreYouSureDialog, setShowAreYouSureDialog] = React.useState(false);

  
  const updateInDBifEdit = (newValue, settingName) => {
    if (isEdit) {
      // update db
      setError("");
      updateEventSetting(orgId, event.event_id, newValue, settingName).then(
        (isSuccess) => {
          if (!isSuccess) {
            setError("Your data didn't save properly");
          }
        }
      );
    }
  };
  const handleCreateEvent = () => {
    if (!isEdit) {
      setError("");
      const newEvent = {
        event_name: name,
        event_start: start,
        event_end: end,
        event_location: location,
        event_description: desc,
        event_type: type,
      };
      // call api then reload
      createNewEvent(orgId, newEvent).then((isSuccess) => {
        if (!isSuccess) {
          setError("Error creating your event, try again");
          return;
        }
        window.location.reload();
      });
    }
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
        {isEdit ? "Edit Event" : "Create Event"}
      </button>
      <Dialog
        onClose={() => {
          setIsOpen(false);
        }}
        open={isOpen}
      >
        <DialogTitle>{isEdit ? "Edit Event" : "Create Event"}</DialogTitle>
        <DialogContent>
          {isEdit ? <p>Changes are saved as you enter them</p> : <></>}
          {error !== "" ? <p className="error">{error}</p> : <></>}
          {/* Name */}
          <UserInput
            label="Name"
            color={color}
            value={name}
            setValue={setName}
            isMultiline={false}
            onLeaveField={(newValue) => {
              if (newValue.trim() === "") {
                setError("Name must have a value");
                return;
              }
              setError("");
              updateInDBifEdit(newValue, "event_name");
            }}
          />
          {/* Description */}
          <UserInput
            label="Description"
            color={color}
            value={desc}
            setValue={setDesc}
            isMultiline={true}
            onLeaveField={(newValue) => {
              if (newValue.trim() === "") {
                setError("Description must have a value");
                return;
              }
              setError("");
              updateInDBifEdit(newValue, "event_description");
            }}
          />
          {/* Location */}
          <UserInput
            label="Location"
            color={color}
            value={location}
            setValue={setLocation}
            isMultiline={false}
            onLeaveField={(newValue) => {
              if (newValue.trim() === "") {
                setError("Location must have a value");
                return;
              }
              setError("");
              updateInDBifEdit(newValue, "event_location");
            }}
          />
          {/* Meeting Type Select */}
          <CustomSelect
            label="Event Type"
            color={color}
            options={[
              "general meeting",
              "volunteer",
              "social",
              "workshop",
              "fundraiser",
              "committee",
            ]}
            startingValue={event && event.event_type !== "general_meeting"
                ? event.event_type
                : "general meeting"}
            onSelect={(value) => {
              updateInDBifEdit(value, "event_type");
              setType(value);
            }}
          />
          {/* Start Date Time */}
          <DatePicker
            label="Start"
            color={color}
            value={start}
            setValue={setStart}
            onLeaveField={(newValue) => {
              updateInDBifEdit(newValue, "event_start");
            }}
          />
          {/* Emd Date Time */}
          <DatePicker
            label="End"
            color={color}
            value={end}
            setValue={setEnd}
            onLeaveField={(newValue) => {
              // TODO save in db
              updateInDBifEdit(newValue, "event_end");
            }}
          />
        </DialogContent>
        <DialogActions>
          {isEdit ? (
            <div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.location.reload();
                }}
                className="custom-color-button"
                style={{ backgroundColor: color, borderColor: color }}
              >
                Done
              </button>
            </div>
          ) : (
            <div>
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
                onClick={handleCreateEvent}
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
            </div>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
