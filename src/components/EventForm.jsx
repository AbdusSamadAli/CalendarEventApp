import PropTypes from "prop-types";
import { Button } from "./ui/button";
const EventForm = ({ newEvent, setNewEvent, handleAddEvent, editingEvent }) => (
  <div className="event-form mb-8">
    <input
      type="text"
      placeholder="Event Name"
      className="w-full p-2 border mb-4"
      value={newEvent.name}
      onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
    />
    <input
      type="datetime-local"
      className="w-full p-2 border mb-4"
      value={newEvent.startTime}
      onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
    />
    <input
      type="datetime-local"
      className="w-full p-2 border mb-4"
      value={newEvent.endTime}
      onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
    />
    <textarea
      placeholder="Event Description"
      className="w-full p-2 border mb-4"
      value={newEvent.description}
      onChange={(e) =>
        setNewEvent({ ...newEvent, description: e.target.value })
      }
    />

    {/* Color Picker for Event */}
    <div className="color-picker mb-4">
      <label className="block mb-2">Choose Event Color:</label>
      <select
        value={newEvent.color}
        onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
        className="w-full p-2 border"
      >
        <option value="blue">Blue</option>
        <option value="green">Green</option>
        <option value="red">Red</option>
        <option value="yellow">Yellow</option>
        <option value="purple">Purple</option>
      </select>
    </div>

    <Button
      onClick={handleAddEvent}
      className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-800"
    >
      {editingEvent ? "Save Event" : "Add Event"}
    </Button>
  </div>
);

EventForm.propTypes = {
  newEvent: PropTypes.shape({
    name: PropTypes.string.isRequired, 
    startTime: PropTypes.string.isRequired, 
    endTime: PropTypes.string.isRequired, 
    description: PropTypes.string, 
    color: PropTypes.string, 
  }).isRequired,
  setNewEvent: PropTypes.func.isRequired, 
  handleAddEvent: PropTypes.func.isRequired, 
  editingEvent: PropTypes.object, 
};

export default EventForm;
