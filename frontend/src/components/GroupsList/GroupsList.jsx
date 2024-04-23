import { NavLink } from "react-router-dom";
// import { csrfFetch } from "../../store/csrf";
import { useDispatch, useSelector } from "react-redux";
import { getGroups } from "../../store/group";

function GroupsList() {
    const dispatch = useDispatch();

    dispatch(getGroups());

    const groups = useSelector((state) => Object.keys(state.Groups));

    return (
        <div id="groups-div">
            <div id="groups-list-nav-bar">
                <NavLink to="/events">Events</NavLink>
                <span className="current-page">Groups</span>
            </div>
            <p>Groups in meatup</p>
            <ul id="groups-list">
                {/* groups.map each item into group cards to list (dont forget to console log!) */}
            </ul>
        </div>
    );
}

export default GroupsList;
