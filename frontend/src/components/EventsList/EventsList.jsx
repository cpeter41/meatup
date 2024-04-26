import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "../../store/event";
import { NavLink } from "react-router-dom";
import "./EventsList.css";

export default function EventsList() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getEvents());
    }, [dispatch]);

    const eventsObj = useSelector((state) => state.events);

    // NOTE: may need to call event details to get description for each item

    return (
        <div>
            <div>
                <span>Events</span>
                <NavLink to="/groups">Groups</NavLink>
            </div>
            <p>Events in meatup</p>
            <ul>
                {eventsObj &&
                    eventsObj.Events &&
                    eventsObj.Events.map((event) => {
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
                    })}
            </ul>
        </div>
    );
}
