import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function HomeNavCard({ type }) {
    const sessionUser = useSelector((state) => state.session.user);

    switch (type) {
        case "see-all-groups":
            return (
                <div className="home-nav-card" id="see-all-groups">
                    <img src="../../../images/handshake.png" alt="handshake" />
                    <NavLink to="/groups">See all groups</NavLink>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                </div>
            );
        case "find-an-event":
            return (
                <div className="home-nav-card" id="find-an-event">
                    <img
                        src="../../../images/meat_stand.png"
                        alt="a meat stand"
                    />
                    <NavLink to="/events">Find an event</NavLink>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                </div>
            );
        case "create-group":
            return (
                <div className="home-nav-card" id="create-group">
                    <img src="../../../images/sausage.png" alt="sausage" />
                    {sessionUser ? (
                        <NavLink to="/groups/new">Start a new Group</NavLink>
                    ) : (
                        <span className="disabled">Start a new Group</span>
                    )}
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                </div>
            );
        default:
    }
}

export default HomeNavCard;
