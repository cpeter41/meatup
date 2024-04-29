import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function HomeNavCard({ type }) {
    const sessionUser = useSelector((state) => state.session.user);

    switch (type) {
        case "see-all-groups":
            return (
                <div className="home-nav-card">
                    <img
                        src="https://news.utexas.edu/wp-content/uploads/2019/06/Mixed-Race-Hands.jpg"
                        alt="handshake"
                    />
                    <NavLink to="/groups" className="nav-link">
                        See all groups
                    </NavLink>
                    <p>
                        View a list of all groups on meatup
                    </p>
                </div>
            );
        case "find-an-event":
            return (
                <div className="home-nav-card">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/A_meat_stand_in_La_Boqueria.jpg/640px-A_meat_stand_in_La_Boqueria.jpg"
                        alt="a meat stand"
                    />
                    <NavLink to="/events" className="nav-link">
                        Find an event
                    </NavLink>
                    <p>
                        View a list of all events hosted by meatup members
                    </p>
                </div>
            );
        case "create-group":
            return (
                <div className="home-nav-card">
                    <img
                        src="https://natashaskitchen.com/wp-content/uploads/2017/04/Homemade-Sausage-2-500x500.jpg"
                        alt="sausage"
                    />
                    {sessionUser ? (
                        <NavLink to="/groups/new" className="nav-link">
                            Start a new Group
                        </NavLink>
                    ) : (
                        <span className="disabled">Start a new Group</span>
                    )}
                    <p>
                        Invite others to try meats of your own!
                    </p>
                </div>
            );
        default:
    }
}

export default HomeNavCard;
