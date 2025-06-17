import { useState } from "react";
import SidePanel from "./SidePanel";
import EventForm from "./EventForm";
import { Button } from "./ui/button"; 

const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);
  const [events, setEvents] = useState(
    JSON.parse(localStorage.getItem("events")) || {}
  );
  const [newEvent, setNewEvent] = useState({
    name: "",
    startTime: "",
    endTime: "",
    description: "",
    color: "blue", 
  });
  const [filterKeyword, setFilterKeyword] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);

  // Handle day navigation
  const changeDay = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + direction);

    setSelectedDate(newDate);

    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };

  const exportToJson = () => {
    const jsonData = JSON.stringify(events, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "events.json";
    link.click();
  };

  const exportToCsv = () => {
    const header = [
      "Event Name",
      "Start Time",
      "End Time",
      "Description",
      "Color",
    ];
    const rows = [];

    Object.values(events).forEach((eventList) => {
      eventList.forEach((event) => {
        rows.push([event.name, event.startTime, event.endTime, event.description, event.color]);
      });
    });

    const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "events.csv";
    link.click();
  };

  const getDaysInMonth = (month, year) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = []; 

    const firstDayWeekday = firstDay.getDay();
    const totalDays = lastDay.getDate();

    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  const handleAddEvent = () => {
    if (!newEvent.name || !newEvent.startTime || !newEvent.endTime) {
      alert("Please fill in all required fields.");
      return;
    }

    const dateKey = selectedDate.toISOString().split("T")[0];

    if (!editingEvent) {
      const existingEvents = events[dateKey] || [];
      const overlap = existingEvents.some((event) => {
        const eventStart = new Date(event.startTime);
        const eventEnd = new Date(event.endTime);
        const newEventStart = new Date(newEvent.startTime);
        const newEventEnd = new Date(newEvent.endTime);

        return (  // Check if the new event overlaps with any existing event
          (newEventStart < eventEnd && newEventEnd > eventStart) ||
          (newEventEnd > eventStart && newEventStart < eventEnd)
        );
      });

      if (overlap) {
        alert("This event overlaps with an existing event.");
        return;
      }
    }

    const updatedEvents = { ...events };
    if (!updatedEvents[dateKey]) {
      updatedEvents[dateKey] = [];
    }

    if (editingEvent) {
      updatedEvents[dateKey] = updatedEvents[dateKey].map((event) =>
        event.id === editingEvent.id ? { ...newEvent, id: event.id } : event
      );
      setEditingEvent(null);
    } else {
      updatedEvents[dateKey].push({ ...newEvent, id: Date.now() });
    }

    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    setNewEvent({
      name: "",
      startTime: "",
      endTime: "",
      description: "",
      color: "blue",
    });
  };

  const handleDeleteEvent = (eventId) => {
    const dateKey = selectedDate.toISOString().split("T")[0];  // Get the date key for the selected date
    const updatedEvents = { ...events };
    updatedEvents[dateKey] = updatedEvents[dateKey].filter( // Remove the event with the given ID
      (event) => event.id !== eventId
    );

    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents)); // Save the updated events to the state and localStorage
  };

  const handleEditEvent = (event) => { // Pre-fill the form with the event data for editing
    setNewEvent({
      name: event.name,
      startTime: event.startTime,
      endTime: event.endTime,
      description: event.description,
      color: event.color, 
    });
    setEditingEvent(event);
  };

  const formatDate = (date) => {   // Format the date in a readable string (e.g., "Thu, Dec 22, 2024")
    return date.toLocaleString("default", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="calendar-container max-w-lg mx-auto p-6 font-sans">
      <h1 className="text-xl sm:text-xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-center py-6 drop-shadow-lg">EventHorizon- A Dynamic Event Calendar Application</h1>
      <div className="calendar-header flex justify-between items-center mb-6">
        <Button
          onClick={() => changeDay(-1)}
          className="bg-indigo-500 hover:bg-blue-800 px-4 py-2"
        >
          &lt; Previous Day
        </Button>

        {/* Main Heading */}
        <h2 className="text-2xl font-semibold mx-4 text-white ml-4 pr-3">
          Events for {formatDate(selectedDate)}
        </h2>

        {/* Next Day Button */}
        <Button
          onClick={() => changeDay(1)}
          className="bg-indigo-500 hover:bg-blue-800 px-4 py-2"
        >
          Next Day &gt;
        </Button>
      </div>

      <div className="calendar-grid flex flex-col mb-8">
        <div className="calendar-grid-header grid grid-cols-7 text-center font-semibold text-lg text-white">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div className="calendar-grid-body grid grid-cols-7 gap-2">
          {daysInMonth.map((date, index) => {
            // Identify weekends
            const isWeekend = date && (date.getDay() === 0 || date.getDay() === 6);

            return (
              <div
                key={index}
                className={`calendar-day relative flex items-center justify-center cursor-pointer border ${
                  date ? "bg-white" : "bg-transparent cursor-default"
                } ${
                  date && date.toDateString() === today.toDateString()
                    ? "bg-purple-500 text-black font-extrabold"
                    : ""
                } ${
                  date && date.toDateString() === selectedDate.toDateString()
                    ? "bg-purple-400 text-black font-extrabold"
                    : ""
                } ${
                  isWeekend ? "bg-gray-200 text-blue-800" : "bg-white"
                } p-4 rounded-lg shadow-md hover:bg-blue-200`}
                onClick={() => setSelectedDate(date)}
              >
                {date ? date.getDate() : ""}

                {/* Event Dot with color coding */}
                {date &&
                  events[date.toISOString().split("T")[0]]?.some(
                    (event) => event.startTime
                  ) && (
                    <div
                      className="event-dot absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          events[date.toISOString().split("T")[0]]?.[0]?.color,
                      }}
                    />
                  )}
              </div>
            );
          })}
        </div>
      </div>

      <EventForm
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        handleAddEvent={handleAddEvent}
        editingEvent={editingEvent}
      />

      <div className="export-options flex justify-between mb-4">
        <Button onClick={exportToJson} className="bg-indigo-500 text-white">
          Export to JSON
        </Button>
        <Button onClick={exportToCsv} className="bg-indigo-500 text-white">
          Export to CSV
        </Button>
      </div>

      <SidePanel
        events={events}
        selectedDate={selectedDate}
        filterKeyword={filterKeyword}
        setFilterKeyword={setFilterKeyword}
        handleEditEvent={handleEditEvent}
        handleDeleteEvent={handleDeleteEvent}
      />
    </div>
  );
};

export default Calendar;
