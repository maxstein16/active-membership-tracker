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

export default function EditEventsDialog({ orgId, color, event }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [error, setError] = React.useState("");
  const [name, setName] = React.useState(event.event_name);
  const [desc, setDesc] = React.useState(event.event_description);
  const [location, setLocation] = React.useState(event.event_location);
  const [start, setStart] = React.useState(moment(event.event_start));
  const [end, setEnd] = React.useState(moment(event.event_end));

  return (
    <div>
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        style={{ color: color, borderColor: color }}
        className="secondary custom-color-button"
      >
        Edit Event
      </button>
      <Dialog
        onClose={() => {
          setIsOpen(false);
        }}
        open={isOpen}
      >
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <p>Changes are saved as you enter them</p>
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
              // TODO save in db
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
              // TODO save in db
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
              // TODO save in db
            }}
          />
          {/* Start Date Time */}
          <DatePicker
            label="Start"
            color={color}
            value={start}
            setValue={setStart}
            onLeaveField={(newValue) => {
              // TODO save in db
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
            }}
          />
        </DialogContent>
        <DialogActions>
          <button
            onClick={() => {
              setIsOpen(false);
            }}
            className="custom-color-button"
            style={{ backgroundColor: color, borderColor: color }}
          >
            Done
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
