import { NavLink } from "react-router-dom";
// import { csrfFetch } from "../../store/csrf";
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
            <div id="groups-list-nav-bar">
                <NavLink to="/events">Events</NavLink>
                <span className="current-page">Groups</span>
            </div>
            <p>Groups in meatup</p>
            <ul id="groups-list">
                {groupsObj &&
                    groupsObj.Groups &&
                    groupsObj.Groups.map((group) => {
                        return (
                            <li className="group-card" key={group.id}>
                                <NavLink to={`/groups/${group.id}`}>
                                    <div className="placeholder-img"></div>
                                    <div className="group-info-card">
                                        <h3>{group.name}</h3>
                                        <span>{group.city}</span>
                                        <p>{group.about}</p>
                                        <span>
                                            # events ·{" "}
                                            {group.private
                                                ? "Private"
                                                : "Public"}
                                        </span>
                                    </div>
                                </NavLink>
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
}

export default GroupsList;
