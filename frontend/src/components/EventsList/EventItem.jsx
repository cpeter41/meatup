import { NavLink } from "react-router-dom";
import "./EventsList.css";

export default function EventItem({ event, list }) {
    return (
        <li
            key={event.id}
            className="event-card"
            style={{
                width: list ? "800px" : "516px",
                height: list ? "280px" : "auto",
            }}
        >
            <NavLink to={`/events/${event.id}`} className="event-link">
                <div className="event-top-half">
                    <img
                        className={(list ? "list" : "event") + "-preview-image"}
                        src={event.previewImage}
                    />
                    <div className="event-card-title">
                        {event && (
                            <>
                                <span
                                    style={{ color: "teal", fontSize: "small" }}
                                >
                                    {event.startDate.slice(0, 10)} ·{" "}
                                    {event.startDate.slice(10)}
                                </span>
                                <h3>{event.name}</h3>
                                <p style={{ color: "gray" }}>
                                    {event.Venue.city}, {event.Venue.state}
                                </p>
                            </>
                        )}
                    </div>
                </div>
                <p className="event-desc">{event.description}</p>
            </NavLink>
        </li>
    );
}
