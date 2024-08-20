import { useEffect, useState } from "react";
import { CALENDAR_EVENT_STYLE } from "../../components/CalendarView/util";

const THEME_BG = CALENDAR_EVENT_STYLE;

function CalendarEventsBodyRightDrawer({ filteredEvents }) {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const handleEventClick = (event) => {
        console.log("Event clicked:", event); // Debugging
        setSelectedEvent(event);
        const modal = document.getElementById('event_details_modal');
        if (modal) {
            modal.showModal();
        }
    };
    

    const closeModal = () => {
        setSelectedEvent(null);
        const modal = document.getElementById('event_details_modal');
        if (modal) {
            modal.close();
        }
    };

    useEffect(() => {
        console.log("Selected Event:", selectedEvent); // Debugging
    }, [selectedEvent]);

    return (
        <>
            {filteredEvents.map((e, k) => (
                <div 
                    key={k} 
                    className={`grid mt-3 card rounded-box p-3 ${THEME_BG[e.theme] || ""}`}
                    onClick={() => handleEventClick(e)}
                    style={{ cursor: 'pointer' }} // Indicate clickable
                >
                    {e.title}
                </div>
            ))}

            {/* Event Details Modal */}
            <dialog id="event_details_modal" className="modal">
    <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">
            {selectedEvent ? selectedEvent.title : 'No Event Selected'}
        </h3>
        <div className="py-4">
            {selectedEvent ? (
                <div>
                    {/* <h4 className="font-bold mb-2 text-xl">Details</h4> */}
                    <p><strong>Destination:</strong> {selectedEvent.company || 'N/A'}</p>
                    <p><strong>PKL Place Name:</strong> {selectedEvent.pklPlaceName || 'N/A'}</p>
                    <p><strong>Date:</strong> {selectedEvent.startTime ? new Date(selectedEvent.startTime).toLocaleDateString() : 'N/A'}</p>
                </div>
            ) : (
                <p>No event selected.</p>
            )}
        </div>
        <div className="modal-action">
            <button type="button" className="btn" onClick={closeModal}>Close</button>
        </div>
    </form>
</dialog>

        </>
    );
}

export default CalendarEventsBodyRightDrawer;
