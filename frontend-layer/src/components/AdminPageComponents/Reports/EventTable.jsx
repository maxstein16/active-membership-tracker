import * as React from "react";
import "../../../assets/css/constants.css";
import "../../../assets/css/pageSetup.css";
import "../../../assets/css/general.css";
import "../../../assets/css/memberPages.css";
import { Paper, Dialog, DialogTitle, DialogContent, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MemberTable from "../MemberTable";
import DownloadReport from "./DownloadReport";
import { getOrganizationEvents, getEventAttendees } from "../../../utils/handleSettingsData";

export default function EventTable({ orgId, color }) {
  const [events, setEvents] = React.useState([]);
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getOrganizationEvents(orgId).then((result) => {
      if (!result || result.error) {
        console.error("Error fetching events:", result?.error);
        setLoading(false);
        return;
      }
      const formattedEvents = result.map(event => ({
        eventId: event.event_id,
        eventName: event.event_name,
        eventStart: event.event_start?.split('T')[0] || "N/A",
        eventEnd: event.event_end ? event.event_end.split('T')[0] : "N/A",
        eventLocation: event.event_location || "Unknown",
        eventDescription: event.event_description || "No description available",
        eventType: event.event_type || "Unknown",
        organizationId: event.organization_id,
        semesterId: event.semester_id,
        totalAttendance: 0,
        members: [],
        id: event.event_id
      }));
      setEvents(formattedEvents);
      setLoading(false);
    }).catch(error => {
      console.error("Error fetching events:", error);
      setLoading(false);
    });
  }, [orgId]);

  const handleRowClick = (event) => {
    const selectedEvent = event.row;
    setSelectedEvent(selectedEvent);

    getEventAttendees(selectedEvent.eventId)
      .then((attendees) => {
        setSelectedEvent((prevEvent) => ({
          ...prevEvent,
          members: attendees || [],
          totalAttendance: attendees ? attendees.length : 0,
        }));
      })
      .catch(error => {
        console.error("Error fetching attendees:", error);
      });
  };

  const columns = [
    { field: "eventId", headerName: "Event ID", width: 100 },
    { field: "eventName", headerName: "Event Name", width: 250 },
    { 
      field: "eventType", 
      headerName: "Event Type", 
      width: 200,
      renderCell: (params) => (
        <span style={{ textTransform: "capitalize" }}>
          {params.value}
        </span>
      )
    },
    { field: "eventStart", headerName: "Start Date", width: 200 },
    { field: "eventEnd", headerName: "End Date", width: 200 },
    { field: "eventLocation", headerName: "Location", width: 200 }
  ];

  return (
    <div className="event-table-wrapper">
      <h2>Past Events</h2>
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={events}
            columns={columns}
            pageSizeOptions={[5, 10, 15, 25, 100]} // Fix for MUI warning
            sx={{
              border: 0,
              "& .MuiDataGrid-row:hover": { backgroundColor: `${color}33` },
            }}
            onRowClick={handleRowClick}
          />
        </Paper>
      )}
      {selectedEvent && (
        <Dialog open={Boolean(selectedEvent)} onClose={() => setSelectedEvent(null)}>
          <DialogTitle>Event Details</DialogTitle>
          <DialogContent>
            <p><strong>Event Name:</strong> {selectedEvent.eventName}</p>
            <p>
              <strong>Event Type:</strong> 
              <span style={{ textTransform: "capitalize" }}>
                {selectedEvent.eventType || "Unknown"}
              </span>
            </p>
            <p><strong>Start Date:</strong> {selectedEvent.eventStart}</p>
            <p><strong>End Date:</strong> {selectedEvent.eventEnd}</p>
            <p><strong>Location:</strong> {selectedEvent.eventLocation}</p>
            <p><strong>Description:</strong> {selectedEvent.eventDescription}</p>
            <p><strong>Total Attendance:</strong> {selectedEvent.totalAttendance}</p>
            {selectedEvent.members.length > 0 ? (
              <MemberTable color={color} membersList={selectedEvent.members} />
            ) : (
              <p>No attendees for this event.</p>
            )}
            <DownloadReport color={color} classToDownload="event-details" />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
