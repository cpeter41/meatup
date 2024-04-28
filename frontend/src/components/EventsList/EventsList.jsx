import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "../../store/event";
import { NavLink } from "react-router-dom";
import EventItem from "./EventItem";
import "./EventsList.css";
import "../GroupsList/GroupsList.css";

export default function EventsList() {
    const dispatch = useDispatch();

    const eventsObj = useSelector((state) => state.events);

    useEffect(() => {
        dispatch(getEvents());
    }, [dispatch]);

    // TODO: this is defined in 3 files, just import it
    function newFormattedDate() {
        const dateTimeParts = new Date()
            .toLocaleString("en-US", { hour12: false })
            .split(",");
        const dateParts = dateTimeParts[0].split("/");
        if (dateParts[0].length === 1) dateParts[0] = `0${dateParts[0]}`;
        const newDate = [dateParts[2], dateParts[0], dateParts[1]].join("-");
        return [newDate, dateTimeParts[1]].join("");
    }

    const sortMap = (events) => {
        const upcomingEvents = [];
        const pastEvents = [];
        let lastUpcomingDate, lastPastDate;
        events.forEach((event) => {
            // sort
            if (event.startDate > newFormattedDate()) {
                if (event.startDate > lastUpcomingDate) {
                    upcomingEvents.unshift(event);
                    lastUpcomingDate = event.startDate;
                } else {
                    upcomingEvents.push(event);
                }
            } else {
                if (event.startDate > lastPastDate) {
                    pastEvents.push(event);
                    lastPastDate = event.startDate;
                } else {
                    pastEvents.unshift(event);
                }
            }
        });

        upcomingEvents.sort((a, b) => {
            if (a.startDate < b.startDate) return -1;
            else if (a.startDate === b.startDate) return 0;
            else return 1;
        });
        // convert to react components
        const upcomingItems = upcomingEvents.map((event) => {
            return (
                <>
                    <hr />
                    <EventItem key={event.id} event={event} list />
                </>
            );
        });

        pastEvents.sort((a, b) => {
            if (a.startDate < b.startDate) return -1;
            else if (a.startDate === b.startDate) return 0;
            else return 1;
        });
        // convert to react components
        const pastItems = pastEvents.map((event) => {
            return (
                <>
                    <hr />
                    <EventItem key={event.id} event={event} list />
                </>
            );
        });

        const both = upcomingItems.concat(pastItems);

        return both;
    };

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
                    {eventsObj?.Events && sortMap(eventsObj.Events)}
                    {/* eventsObj.Events.map((event) => (
                            <>
                                <hr />
                                <EventItem key={event.id} event={event} list />
                            </>
                        ))} */}
                </ul>
            </div>
        </div>
    );
}
