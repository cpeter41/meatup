import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getGroups } from "../../store/group";
import "./GroupsList.css";

function GroupsList() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getGroups());
    }, [dispatch]);

    const groupsObj = useSelector((state) => state.groups);

    return (
        <div id="groups-div">
            <div style={{ width: "800px" }}>
                <div id="groups-list-nav-bar">
                    <NavLink
                        to="/events"
                        style={{ textDecoration: "none", color: "grey" }}
                    >
                        Events
                    </NavLink>
                    <span
                        className="current-page"
                        style={{ textDecoration: "underline", color: "teal" }}
                    >
                        Groups
                    </span>
                </div>
                <p style={{ color: "gray" }}>Groups in meatup</p>
                <ul id="groups-list">
                    {groupsObj &&
                        groupsObj.Groups &&
                        groupsObj.Groups.map((group) => {
                            return (
                                <div key={group.id}>
                                    <hr />
                                    <li
                                        
                                        style={{ borderRadius: "16px" }}
                                    >
                                        <NavLink
                                            className="group-card"
                                            to={`/groups/${group.id}`}
                                        >
                                            <img src={group.previewImage} />
                                            <div className="group-info-card">
                                                <h3>{group.name}</h3>
                                                <span style={{ color: "gray" }}>
                                                    {group.city}, {group.state}
                                                </span>
                                                <p>{group.about}</p>
                                                <span
                                                    style={{ color: "gray" }}
                                                    className="event-count"
                                                >
                                                    {group.eventCount}{" "}
                                                    {group.eventCount === 1
                                                        ? "event · "
                                                        : "events · "}
                                                    {group.private
                                                        ? "Private"
                                                        : "Public"}
                                                </span>
                                            </div>
                                        </NavLink>
                                    </li>
                                </div>
                            );
                        })}
                </ul>
            </div>
        </div>
    );
}

export default GroupsList;
