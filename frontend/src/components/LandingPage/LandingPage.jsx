import HomeNavCard from "./HomeNavCard";
import IntroCard from "./IntroCard";
import DescriptionBox from "./DescriptionBox";
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
            <div>
                <button id="join-meatup">Join meatup</button>
            </div>
        </div>
    );
}

export default LandingPage;
