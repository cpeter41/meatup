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
                    Whatever your interest, from boardgames and grilling to
                    dancing and eating, there are thousands of people
                    who share it on meatup. Events are happening every day—sign
                    up to join the fun.
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
