import { useEffect } from "react";

function SignUpintro() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://animatedicons.co/scripts/embed-animated-icons.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const serviceIcon = `
    <animated-icons
      src="https://animatedicons.co/get-icon?name=Maintenance&style=minimalistic&token=c427791f-d7f8-4a99-a56b-60ef3373e1f7"
      trigger="loop"
      attributes='{"variationThumbColour":"#536DFE","variationName":"Two Tone","variationNumber":2,"numberOfGroups":2,"backgroundIsGroup":false,"strokeWidth":1,"defaultColours":{"group-1":"#000000","group-2":"#536DFE","background":"#FFFFFF"}}'
      height="40"
      width="40"
    ></animated-icons>
  `;

    const resourceIcon = `
        <animated-icons
    src="https://animatedicons.co/get-icon?name=Product&style=minimalistic&token=64f0cb11-7ef5-4030-8e65-e6b4975a0256"
    trigger="loop"
    attributes='{"variationThumbColour":"#536DFE","variationName":"Two Tone","variationNumber":2,"numberOfGroups":2,"backgroundIsGroup":false,"strokeWidth":1,"defaultColours":{"group-1":"#000000","group-2":"#536DFE","background":"#FFFFFF"}}'
    height="40"
    width="40"
    ></animated-icons>

  `;

    return (
        <div className="sign-up-intro">
            <header className="sign-up-intro-header">
                <h1>Welcome to the Sign-Up Page!</h1>
                <p>What are you looking for</p>
            </header>

            <main className="sign-up-intro-main">
                <div className="sign-up-intro-card">
                    <h2>I am looking for</h2>
                    <button className="sign-up-intro-button">
                        <span
                            className="icon-container"
                            dangerouslySetInnerHTML={{ __html: serviceIcon }}
                        />
                        <span>Service</span>
                    </button>

                    <button className="sign-up-intro-button">
                        <span
                            className="icon-container"
                            dangerouslySetInnerHTML={{ __html: resourceIcon }}
                        />
                        <span>Resource</span>
                    </button>
                </div>

                <div className="sign-up-intro-card">
                    <h2>I am offering</h2>
                    <button className="sign-up-intro-button">
                        <span
                            className="icon-container"
                            dangerouslySetInnerHTML={{ __html: serviceIcon }}
                        />
                        <span>Service</span>
                    </button>

                    <button className="sign-up-intro-button">
                        <span
                            className="icon-container"
                            dangerouslySetInnerHTML={{ __html: resourceIcon }}
                        />
                        <span>Resource</span>
                    </button>
                </div>
            </main>
        </div>
    );
}

export default SignUpintro;

