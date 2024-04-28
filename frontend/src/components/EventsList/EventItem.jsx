import { NavLink } from "react-router-dom";
import "./EventsList.css";

export default function EventItem({ event }) {
    console.log(event);
    return (
        <li key={event.id} className="event-card">
            <NavLink to={`/events/${event.id}`} className="event-link">
                <div className="event-top-half">
                    <img
                        className="event-preview-image"
                        src={event.previewImage}
                    />
                    <div className="event-card-title">
                        <span style={{ color: "teal", fontSize: "small" }}>
                            {event.startDate.slice(0, 10)} ·{" "}
                            {event.startDate.slice(10)}
                        </span>
                        <h3>{event.name}</h3>
                        <p style={{ color: "gray" }}>
                            {event.Venue.city}, {event.Venue.state}
                        </p>
                    </div>
                </div>
                <p>{event.description}</p>
            </NavLink>
        </li>
    );
}
