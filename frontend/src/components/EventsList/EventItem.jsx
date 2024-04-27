import { NavLink } from "react-router-dom";

export default function EventItem({ event }) {
    return (
        <li key={event.id}>
            <NavLink to={`/events/${event.id}`}>
                <div>
                    <img src={event.previewImage} />
                    <div>
                        <span>
                            {event.startDate.slice(0, 10)} ·{" "}
                            {event.startDate.slice(10)}
                        </span>
                        <h3>{event.name}</h3>
                        <p>
                            {event.Venue.city},{" "}
                            {event.Venue.state}
                        </p>
                    </div>
                </div>
            </NavLink>
        </li>
    );
}