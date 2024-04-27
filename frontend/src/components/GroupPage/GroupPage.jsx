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
            events.Events.forEach((event) => {
                const item = <EventItem key={event.id} event={event} />;
                if (event.startDate > newFormattedDate())
                    upcomingEvents.push(item);
                else pastEvents.push(item);
            });
            setUpcoming(upcomingEvents);
            setPast(pastEvents);
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
            <section id="group-preview">
                <div id="group-image-box">
                    <div>
                        <span>
                            &lt; <NavLink to="/groups">Groups</NavLink>
                        </span>
                    </div>
                    <img src={previewImage && previewImage.url} />
                </div>
                <div id="group-preview-and-button">
                    <div id="group-preview-info">
                        <h1>{group && group.name}</h1>
                        <span>{group && group.city}</span>
                        <span>
                            # events ·{" "}
                            {group && group.private ? "Private" : "Public"}
                        </span>
                        <span>
                            Organized By {group && group.Organizer.firstName}{" "}
                            {group && group.Organizer.lastName}
                        </span>
                    </div>
                    {group && user && user.id === group.organizerId ? (
                        <div>
                            <button
                                onClick={() =>
                                    navigate(`/groups/${groupId}/events/new`)
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
                        <button id="join-group-button">Join this group</button>
                    )}
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
                    <h2>Upcoming Events</h2>
                    {events && upcoming}
                </div>
                <div id="past-events">
                    <h2>Past Events</h2>
                    {events && past}
                </div>
            </section>
        </div>
    ) : (
        <h1>Page Not Found</h1>
    );
}

export default GroupPage;
