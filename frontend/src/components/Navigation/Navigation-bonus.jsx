import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton-bonus";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

function Navigation({ isLoaded }) {
    const sessionUser = useSelector((state) => state.session.user);

    return (
        <div id="nav-bar">
            <NavLink to="/">
                <img src="../../../images/meatup_logo.png" alt="logo" />
            </NavLink>
            {isLoaded && sessionUser ? (
                <div id="nav-logged-out">
                    <NavLink className="nav-link" to="/groups/new">
                        Start a new group
                    </NavLink>
                    <ProfileButton user={sessionUser} />
                </div>
            ) : (
                <div id="nav-logged-in">
                    <OpenModalMenuItem
                        itemText="Log In"
                        modalComponent={<LoginFormModal />}
                    />
                    <OpenModalMenuItem
                        itemText="Sign Up"
                        modalComponent={<SignupFormModal />}
                    />
                </div>
            )}
        </div>
    );
}

export default Navigation;
