import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "../../store/event";
import { NavLink } from "react-router-dom";
import "./EventsList.css";
import "../GroupsList/GroupsList.css";
import EventItem from "./EventItem";

export default function EventsList() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getEvents());
    }, [dispatch]);

    const eventsObj = useSelector((state) => state.events);

    return (
        <div id="groups-div">
            <div style={{ width: "800px" }}>
                <div id="groups-list-nav-bar">
                    <span
                        className="current-page"
                        style={{ textDecoration: "underline", color: "teal" }}
                    >
                        Events
                    </span>
                    <NavLink
                        style={{ textDecoration: "none", color: "grey" }}
                        to="/groups"
                    >
                        Groups
                    </NavLink>
                </div>
                <p style={{ color: "gray" }}>Events in meatup</p>
                <ul id="groups-list">
                    {eventsObj &&
                        eventsObj.Events &&
                        eventsObj.Events.map((event) => (
                            <>
                                <hr />
                                <EventItem key={event.id} event={event} list />
                            </>
                        ))}
                </ul>
            </div>
        </div>
    );
}
