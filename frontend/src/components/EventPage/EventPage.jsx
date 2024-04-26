import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEventDetails } from "../../store/event";
import { getGroupDetails } from "../../store/group";
import { IMG_NOT_FOUND } from "../../util/util";
import "./EventPage.css";

export default function EventPage() {
    const dispatch = useDispatch();
    const { eventId } = useParams();
    const [isValidId, setIsValidId] = useState(false);

    let previewImage;

    const event = useSelector((state) => state.events.eventDetails);
    const group = useSelector((state) => state.groups.groupDetails);
    const userId = useSelector((state) => state.session.user.id);

    useEffect(() => {
        if (isNaN(eventId)) setIsValidId(false);
        else setIsValidId(true);

        if (isValidId) {
            dispatch(getEventDetails(eventId));
            dispatch(getGroupDetails(event.groupId));
        }
    }, [dispatch, event.groupId, eventId, isValidId]);

    if (event && event.EventImages) {
        previewImage = event.EventImages.find(
            (eventImage) => eventImage.preview
        );
        if (!previewImage) previewImage = { url: IMG_NOT_FOUND };
    }

    return isValidId ? (
        <div>
            <section>
                <span>
                    &lt; <NavLink to="/events">Events</NavLink>
                </span>
                <h1>{event && event.name}</h1>
                <span>
                    Hosted by{" "}
                    {group &&
                        [
                            group.Organizer.firstName,
                            group.Organizer.lastName,
                        ].join(" ")}
                </span>
            </section>
            <section id="event-details-section">
                <div id="img-details-section">
                    <img src={previewImage && previewImage.url} />
                    <div id="event-details">
                        <div id="event-times">
                            <div className="time-label">
                                <span>START</span>
                                <span>END</span>
                            </div>
                            <div className="time-label">
                                {event && (
                                    <>
                                        <span>
                                            {event.startDate.slice(0, 10)} ·{" "}
                                            {event.startDate.slice(10)}
                                        </span>
                                        <span>
                                            {event.endDate.slice(0, 10)} ·{" "}
                                            {event.endDate.slice(10)}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        <span>
                            {event &&
                                (event.price === 0 ? "FREE" : event.price)}
                        </span>
                        <span>{event && event.type}</span>
                        {group && userId === group.organizerId && (
                            <button>Delete</button>
                        )}
                    </div>
                </div>
                <div>
                    <h2>Details</h2>
                    <p>{event && event.description}</p>
                </div>
            </section>
        </div>
    ) : (
        <h1>Page Not Found</h1>
    );
}
