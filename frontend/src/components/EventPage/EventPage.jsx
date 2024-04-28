import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEventDetails } from "../../store/event";
import { getGroupDetails } from "../../store/group";
import { IMG_NOT_FOUND } from "../../util/util";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import ConfirmModal from "../ConfirmModal";
import "./EventPage.css";

export default function EventPage() {
    const dispatch = useDispatch();
    const { eventId } = useParams();
    const [isValidId, setIsValidId] = useState(false);
    const event = useSelector((state) => state.events.eventDetails);
    const group = useSelector((state) => state.groups.groupDetails);
    const user = useSelector((state) => state.session.user);

    useEffect(() => {
        if (isNaN(eventId)) setIsValidId(false);
        else setIsValidId(true);

        if (isValidId) dispatch(getEventDetails(eventId));
    }, [dispatch, eventId, isValidId]);

    useEffect(() => {
        if (event) dispatch(getGroupDetails(event.groupId));
    }, [dispatch, event]);

    let previewImage;
    if (event && event.EventImages) {
        previewImage = event.EventImages.find(
            (eventImage) => eventImage.preview
        );
        if (!previewImage) previewImage = { url: IMG_NOT_FOUND };
    }

    return isValidId ? (
        <div>
            <section
                style={{
                    backgroundColor: "white",
                    display: "flex",
                    justifyContent: "center",
                    margin: "40px",
                }}
            >
                <div style={{ width: "1024px" }}>
                    <span>
                        &lt; <NavLink to="/events">Events</NavLink>
                    </span>
                    <h1>{event && event.name}</h1>
                    <span style={{ color: "gray" }}>
                        Hosted by:{" "}
                        {group &&
                            [
                                group.Organizer.firstName,
                                group.Organizer.lastName,
                            ].join(" ")}
                    </span>
                </div>
            </section>
            <section id="event-details-section">
                <div id="img-details-section">
                    <img src={previewImage && previewImage.url} />
                    <div id="event-details">
                        <div id="event-details-info">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <i className="fa-regular fa-clock fa-2xl"></i>
                                <div className="time-label">
                                    <span>START</span>
                                    <span>END</span>
                                </div>
                                <div className="time-label">
                                    {event && (
                                        <>
                                            <span style={{ color: "teal" }}>
                                                {event.startDate.slice(0, 10)} ·{" "}
                                                {event.startDate.slice(10)}
                                            </span>
                                            <span style={{ color: "teal" }}>
                                                {event.endDate.slice(0, 10)} ·{" "}
                                                {event.endDate.slice(10)}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <span>
                                <i className="fa-solid fa-dollar-sign fa-2xl"></i>
                                {event &&
                                    (event.price === 0
                                        ? "FREE"
                                        : event.price % 1 === 0
                                        ? `${event.price}.00`
                                        : event.price)}
                            </span>
                            <span>
                                <i className="fa-solid fa-map-pin fa-2xl"></i>
                                {event && event.type}
                            </span>
                        </div>
                        <div style={{ alignSelf: "flex-end" }}>
                            {group &&
                                event &&
                                user &&
                                user.id === group.organizerId && (
                                    <>
                                        <button
                                            onClick={() =>
                                                alert("Feature coming soon!")
                                            }
                                        >
                                            Update
                                        </button>
                                        <OpenModalMenuItem
                                            itemText="Delete"
                                            modalComponent={
                                                <ConfirmModal
                                                    type="event"
                                                    method="DELETE"
                                                    id={event.id}
                                                />
                                            }
                                        />
                                    </>
                                )}
                        </div>
                    </div>
                </div>
                <div style={{ maxWidth: "1014px" }}>
                    <h2 style={{ marginTop: "0" }}>Details</h2>
                    <p>{event && event.description}</p>
                </div>
            </section>
        </div>
    ) : (
        <h1>Page Not Found</h1>
    );
}
