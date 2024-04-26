import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams /*useNavigate*/ } from "react-router-dom";
import { getEventDetails } from "../../store/event";
import { IMG_NOT_FOUND } from "../../util/util";
// import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
// import ConfirmModal from "../ConfirmModal/ConfirmModal";
import "./EventPage.css";
import { useEffect, useState } from "react";
import { csrfFetch } from "../../store/csrf";

export default function EventPage() {
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    const { eventId } = useParams();
    const [isValidId, setIsValidId] = useState(false);
    const [host, setHost] = useState("");

    let previewImage;

    const event = useSelector((state) => state.events.eventDetails);
    // const userId = useSelector((state) => state.session.user.id);

    console.log(event);

    useEffect(() => {
        if (isNaN(eventId)) setIsValidId(false);
        else setIsValidId(true);

        if (isValidId) dispatch(getEventDetails(eventId));
    }, [dispatch, eventId, isValidId]);

    useEffect(() => {
        const groupId = event && event.groupId;
        console.log("id: ", groupId);

        async function getHost() {
            const res = await csrfFetch(`/api/groups/${groupId}`);
            const obj = await res.json();
            setHost(
                [obj.Organizer.firstName, obj.Organizer.lastName].join(" ")
            );
        }

        if (groupId) getHost();
    }, [event]);

    if (event && event.EventImages) {
        previewImage = event.EventImages.find(
            (eventImage) => eventImage.preview
        );
        if (!previewImage) previewImage = { url: IMG_NOT_FOUND };
    }

    return isValidId ? (
        <div>
            <span>
                &lt; <NavLink to="/events">Events</NavLink>
            </span>
            <h1>{event && event.name}</h1>
            <span>Hosted by {host}</span>
        </div>
    ) : (
        <h1>Page Not Found</h1>
    );
}
