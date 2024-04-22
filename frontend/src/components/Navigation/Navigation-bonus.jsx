import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ProfileButton from "./ProfileButton-bonus";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

const logInCredentials = {
    credential: "demo@guy.com",
    password: "password123",
};

function Navigation({ isLoaded }) {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);

    const logInDemo = () => {
        return dispatch(sessionActions.login(logInCredentials));
    };

    return (
        <div id="nav-bar">
            <NavLink to="/">
                <img src="../../../images/meatup_logo.png" alt="logo" />
            </NavLink>
            {isLoaded && sessionUser ? (
                <div className="nav-user">
                    <NavLink to="/groups/new">Start a new group</NavLink>
                    <ProfileButton user={sessionUser} />
                </div>
            ) : (
                <div className="nav-user">
                    <button onClick={logInDemo}>Demo User Log In</button>
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
