import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { getEventDetails } from "../../store/event";
import { IMG_NOT_FOUND } from "../../util/util";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import "./EventPage.css";
import { useEffect, useState } from "react";

export default function EventPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { eventId } = useParams();
    const [isValidId, setIsValidId] = useState(false);

    let previewImage;

    useEffect(() => {
        if (isNaN(eventId)) setIsValidId(false);
        else setIsValidId(true);

        if (isValidId) dispatch(getEventDetails(eventId));
    }, [dispatch, eventId, isValidId]);

    const event = useSelector((state) => state.events.eventDetails);
    const userId = useSelector((state) => state.session.user.id);
    
    // get group info from either a db GET or from cached groups perhaps?
    // need organizer name, group preview pic, group name, and group private status from group

    console.log(event);

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
            <h1>{event.name}</h1>
            <span>Hosted by </span>
        </div>
    ) : (
        <h1>Page Not Found</h1>
    );
}
