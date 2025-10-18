import { FiShoppingCart, FiRefreshCcw, FiStar } from "react-icons/fi";
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
    <div className="max-w-6xl mx-auto p-8 text-center">
      {/* Header */}
      <header className="mb-12">
        {/*
        <h1 className="text-4xl font-bold mb-4">Welcome to the Sign-Up Page!</h1>
        */}
        <p className="text-xl font-semibold mb-6">What are you looking for ?</p>
      </header>

      {/* Cards */}
      <main className="flex flex-wrap justify-center gap-8">
        {/* Looking For */}
        <div className="bg-white/30 rounded-xl shadow-md p-8 min-w-[240px] ">
          <h2 className="text-xl font-semibold mb-6 text-black">I am looking for</h2>

          <button className="flex items-center justify-center gap-3 w-full py-3 mb-4 rounded-lg bg-red-800 text-white font-medium text-base hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-md transition-all">
            <span
              className="flex items-center justify-center min-w-[42px] h-10"
              dangerouslySetInnerHTML={{ __html: serviceIcon }}
            />
            <span>Service</span>
          </button>

          <button className="flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-red-800 text-white font-medium text-base hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-md transition-all">
            <span
              className="flex items-center justify-center min-w-[42px] h-10"
              dangerouslySetInnerHTML={{ __html: resourceIcon }}
            />
            <span>Resource</span>
          </button>
        </div>

        {/* Offering */}
        <div className="bg-white/30 rounded-xl shadow-md p-8 min-w-[240px]">
          <h2 className="text-xl font-semibold mb-6 text-black">I am offering</h2>

          <button className="flex items-center justify-center gap-3 w-full py-3 mb-4 rounded-lg bg-red-800 text-white font-medium text-base hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-md transition-all">
            <span
              className="flex items-center justify-center min-w-[42px] h-10"
              dangerouslySetInnerHTML={{ __html: serviceIcon }}
            />
            <span>Service</span>
          </button>

          <button className="flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-red-800 text-white font-medium text-base hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-md transition-all">
            <span
              className="flex items-center justify-center min-w-[42px] h-10"
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
