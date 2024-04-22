function HomeNavCard({ type }) {
    switch (type) {
        case "see-all-groups":
            return (
                <div className="home-nav-button" id="see-all-groups">
                    <img src="../../../images/handshake.png" alt="handshake" />
                    <h3>See all groups</h3>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                </div>
            );
        case "find-an-event":
            return (
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
            );
        case "create-group":
            return (
                <div className="home-nav-button" id="create-group">
                    <img src="../../../images/sausage.png" alt="sausage" />
                    <h3>Start a new Group</h3>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                </div>
            );
        default:
    }
}

export default HomeNavCard;
