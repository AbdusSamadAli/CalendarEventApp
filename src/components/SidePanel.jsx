import PropTypes from "prop-types";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const SidePanel = ({
  events,
  selectedDate,
  filterKeyword,
  setFilterKeyword,
  handleEditEvent,
  handleDeleteEvent,
}) => {
  const getEventsForSelectedDate = () => {
    const dateKey = selectedDate.toISOString().split("T")[0];
    return (events[dateKey] || []).filter(
      (event) =>
        event.name.toLowerCase().includes(filterKeyword.toLowerCase()) ||
        event.description.toLowerCase().includes(filterKeyword.toLowerCase())
    );
  };

  return (
    <div className="events-list bg-gradient-to-r from-gray-700 via-gray-800 to-black bg-opacity-70 p-4 rounded-lg shadow-md w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 fixed top-0 right-0 h-full overflow-auto transition-all duration-300 ease-in-out">
      <input
        type="text"
        placeholder="Search Events by Keyword"
        value={filterKeyword}
        onChange={(e) => setFilterKeyword(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />

      <h4 className="font-semibold mb-4 text-lg">Events:</h4>

      {getEventsForSelectedDate().length > 0 ? (
        getEventsForSelectedDate().map((event) => (
          <Card
            key={event.id}
            className="event-item mb-4 p-4 shadow-md bg-slate-200 hover:bg-slate-400 rounded"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="event-details mb-2 sm:mb-0">
                <h6 className="text-xl">{event.name}</h6>
                <p className="text-sm">
                  {event.startTime} - {event.endTime}
                </p>
                <p className="text-sm">{event.description}</p>
              </div>

              <div className="event-actions flex gap-2 mt-2 sm:mt-0 sm:ml-4">
                <Button
                  onClick={() => handleEditEvent(event)}
                  className="text-yellow-600 border border-yellow-600 hover:bg-yellow-100 px-3 py-2 text-xs sm:text-sm"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="text-red-600 border border-red-600 hover:bg-red-100 px-3 py-2 text-xs sm:text-sm"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <p className="text-sm text-white">No events found for this day.</p>
      )}
    </div>
  );
};

SidePanel.propTypes = {
  events: PropTypes.object.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  filterKeyword: PropTypes.string.isRequired,
  setFilterKeyword: PropTypes.func.isRequired,
  handleEditEvent: PropTypes.func.isRequired,
  handleDeleteEvent: PropTypes.func.isRequired,
};

export default SidePanel;
