import "./LandingPage.css";

function IntroCard() {
    return (
        <div id="intro-card">
            <div id="intro-title">
                <h1>
                    The meat platform- <br />
                    Where food inspires friendships
                </h1>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Aenean at ipsum eu nisi faucibus iaculis vel vitae elit.
                    Etiam malesuada urna ac sapien volutpat dapibus. Duis nec
                    erat at est tempor ornare vel sed arcu. Fusce facilisis
                    fringilla lacus a ullamcorper. Duis tincidunt augue nec
                    imperdiet feugiat.
                </p>
            </div>
            <img
                src="https://media.cnn.com/api/v1/images/stellar/prod/230626190944-fourth-of-july-cookout-stock.jpg?c=original"
                alt="outdoor bbq"
            />
        </div>
    );
}

export default IntroCard;
