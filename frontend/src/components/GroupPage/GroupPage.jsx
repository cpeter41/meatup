import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { getGroupDetails } from "../../store/group";
import { useEffect, useState } from "react";
import { IMG_NOT_FOUND } from "../../util/util";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import ConfirmModal from "../ConfirmModal";
import "./GroupPage.css";

function GroupPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { groupId } = useParams();
    const [isValidId, setIsValidId] = useState(false);

    let previewImage;

    useEffect(() => {
        if (isNaN(groupId)) setIsValidId(false);
        else setIsValidId(true);

        if (isValidId) dispatch(getGroupDetails(groupId));
    }, [dispatch, groupId, isValidId]);

    const group = useSelector((state) => state.groups.groupDetails);
    const userId = useSelector((state) => state.session.user.id);

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
                    {group && userId === group.organizerId ? (
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
                                    <ConfirmModal mode="delete" id={groupId} />
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
                </div>
                <div id="past-events">
                    <h2>Past Events</h2>
                </div>
            </section>
        </div>
    ) : (
        <h1>Page Not Found</h1>
    );
}

export default GroupPage;
