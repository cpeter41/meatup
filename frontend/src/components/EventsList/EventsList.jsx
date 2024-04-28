import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "../../store/event";
import { NavLink } from "react-router-dom";
import "./EventsList.css";
import EventItem from "./EventItem";

export default function EventsList() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getEvents());
    }, [dispatch]);

    const eventsObj = useSelector((state) => state.events);

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
                    eventsObj.Events.map((event) => (
                        <EventItem key={event.id} event={event} />
                    ))}
            </ul>
        </div>
    );
}
