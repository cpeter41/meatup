import HomeNavCard from "./HomeNavCard";
import IntroCard from "./IntroCard";
import DescriptionBox from "./DescriptionBox";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import SignupFormModal from "../SignupFormModal";
import "./LandingPage.css";

function LandingPage() {
    return (
        <div id="landing-page">
            <IntroCard />
            <DescriptionBox />
            <div id="nav-help">
                <HomeNavCard type="see-all-groups" />
                <HomeNavCard type="find-an-event" />
                <HomeNavCard type="create-group" />
            </div>
            <div id="join-meatup">
                <OpenModalMenuItem
                    itemText="Join meatup"
                    modalComponent={<SignupFormModal />}
                />
            </div>
        </div>
    );
}

export default LandingPage;
