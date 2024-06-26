import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { getGroupDetails, getGroupEvents } from "../../store/group";
import { useEffect, useState } from "react";
import { IMG_NOT_FOUND } from "../../util/util";
import { EventItem } from "../EventsList";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import ConfirmModal from "../ConfirmModal";
import "./GroupPage.css";

function GroupPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { groupId } = useParams();
    const [isValidId, setIsValidId] = useState(false);
    const [upcoming, setUpcoming] = useState([]);
    const [past, setPast] = useState([]);
    const group = useSelector((state) => state.groups.groupDetails);
    const events = useSelector((state) => state.groups.groupEvents);
    const user = useSelector((state) => state.session.user);

    useEffect(() => {
        if (isNaN(groupId)) setIsValidId(false);
        else setIsValidId(true);

        if (isValidId) {
            dispatch(getGroupDetails(groupId));
            dispatch(getGroupEvents(groupId));
        }
    }, [dispatch, groupId, isValidId]);

    useEffect(() => {
        function newFormattedDate() {
            const dateTimeParts = new Date()
                .toLocaleString("en-US", { hour12: false })
                .split(",");
            const dateParts = dateTimeParts[0].split("/");
            if (dateParts[0].length === 1) dateParts[0] = `0${dateParts[0]}`;
            const newDate = [dateParts[2], dateParts[0], dateParts[1]].join(
                "-"
            );
            return [newDate, dateTimeParts[1]].join("");
        }

        if (events) {
            const upcomingEvents = [];
            const pastEvents = [];
            let lastUpcomingDate, lastPastDate;
            events.Events.forEach((event) => {
                // sort
                if (event.startDate > newFormattedDate()) {
                    if (event.startDate > lastUpcomingDate) {
                        upcomingEvents.unshift(event);
                        lastUpcomingDate = event.startDate;
                    } else upcomingEvents.push(event);
                } else {
                    if (event.startDate > lastPastDate) {
                        pastEvents.push(event);
                        lastPastDate = event.startDate;
                    } else pastEvents.unshift(event);
                }
            });

            upcomingEvents.sort((a, b) => {
                if (a.startDate < b.startDate) return -1;
                else if (a.startDate === b.startDate) return 0;
                else return 1;
            });
            // convert to react components
            const upcomingItems = upcomingEvents.map((event) => {
                return <EventItem key={event.id} event={event} />;
            });

            pastEvents.sort((a, b) => {
                if (a.startDate > b.startDate) return -1;
                else if (a.startDate === b.startDate) return 0;
                else return 1;
            });
            // convert to react components
            const pastItems = pastEvents.map((event) => {
                return <EventItem key={event.id} event={event} />;
            });

            setUpcoming(upcomingItems);
            setPast(pastItems);
        }
    }, [events]);

    let previewImage;
    if (group && group.GroupImages) {
        previewImage = group.GroupImages.find(
            (groupImage) => groupImage.preview
        );
        if (!previewImage) previewImage = { url: IMG_NOT_FOUND };
    }

    return isValidId ? (
        <div id="group-container">
            <section id="preview-background">
                <div id="group-preview">
                    <div id="group-image-box">
                        <div style={{ margin: "4px 0" }}>
                            <span>
                                &lt;{" "}
                                <NavLink className="nav-link" to="/groups">
                                    Groups
                                </NavLink>
                            </span>
                        </div>
                        <img src={previewImage && previewImage.url} />
                    </div>
                    <div id="group-preview-and-button">
                        <div id="group-preview-info">
                            <h1>{group && group.name}</h1>
                            <span>
                                {group?.city}, {group?.state}
                            </span>
                            <span>
                                {events?.Events.length}{" "}
                                {events?.Events.length === 1
                                    ? " event "
                                    : " events "}
                                ·{" "}
                                {group && group.private ? "Private" : "Public"}
                            </span>
                            <span>
                                Organized By:{" "}
                                {group && group.Organizer.firstName}{" "}
                                {group && group.Organizer.lastName}
                            </span>
                        </div>
                        {group && user && user.id === group.organizerId ? (
                            <div className="manage-buttons">
                                <button
                                    className="red-button"
                                    onClick={() =>
                                        navigate(
                                            `/groups/${groupId}/events/new`
                                        )
                                    }
                                >
                                    Create event
                                </button>
                                <button
                                    onClick={() =>
                                        navigate(`/groups/${groupId}/edit`)
                                    }
                                >
                                    Update
                                </button>
                                <OpenModalMenuItem
                                    itemText="Delete"
                                    modalComponent={
                                        <ConfirmModal
                                            type="group"
                                            method="DELETE"
                                            id={groupId}
                                        />
                                    }
                                />
                            </div>
                        ) : (
                            user && (
                                <button
                                    id="join-group-button"
                                    onClick={() =>
                                        alert("Feature coming soon!")
                                    }
                                >
                                    Join this group
                                </button>
                            )
                        )}
                    </div>
                </div>
            </section>
            <section id="group-details">
                <div id="organizer">
                    <h2>Organizer</h2>
                    <span>
                        {group && group.Organizer.firstName}{" "}
                        {group && group.Organizer.lastName}
                    </span>
                </div>
                <div id="about">
                    <h2>What we&apos;re about</h2>
                    <p>{group && group.about}</p>
                </div>
                <div id="upcoming-events">
                    <h2>
                        Upcoming Events {upcoming && `(${upcoming.length})`}
                    </h2>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {events && upcoming}
                    </ul>
                </div>
                {events && past.length ? (
                    <div id="past-events">
                        <h2>Past Events {past && `(${past.length})`}</h2>
                        <ul style={{ listStyleType: "none", padding: 0 }}>
                            {past}
                        </ul>
                    </div>
                ) : null}
            </section>
        </div>
    ) : (
        <h1>Page Not Found</h1>
    );
}

export default GroupPage;
