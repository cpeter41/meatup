// import { useState } from "react";
// import { useDispatch } from "react-redux";
import "./LandingPage.css";

function LandingPage() {
    return (
        <div id="landing-page">
            <div id="intro-card">
                <div id="intro-title">
                    <h1>The meat platform- Where food inspires friendships</h1>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aenean at ipsum eu nisi faucibus iaculis vel vitae elit.
                        Etiam malesuada urna ac sapien volutpat dapibus. Duis
                        nec erat at est tempor ornare vel sed arcu. Fusce
                        facilisis fringilla lacus a ullamcorper. Duis tincidunt
                        augue nec imperdiet feugiat.
                    </p>
                </div>
                <img src="../../../images/home_image.png" alt="outdoor bbq" />
            </div>
            <div id="meatup-desc">
                <h2>How meatup works</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div id="nav-help">
                <div className="home-nav-button" id="see-all-groups">
                    <img src="../../../images/handshake.png" alt="handshake" />
                    <h3>See all groups</h3>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                </div>
                <div className="home-nav-button" id="find-an-event">
                    <img
                        src="../../../images/meat_stand.png"
                        alt="a meat stand"
                    />
                    <h3>Find an event</h3>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                </div>
                <div className="home-nav-button" id="create-group">
                    <img src="../../../images/sausage.png" alt="sausage" />
                    <h3>Start a new Group</h3>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                </div>
            </div>
            <button id="join-meatup">Join meatup</button>
        </div>
    );
}

export default LandingPage;
