import React from "react";
import doodle from "../../public/images/doodleLMFAO.png";

const Landing = () => {
    return (
        <main className="flex-grow flex flex-col justify-evenly text-center items-center">
            <img src={doodle} className="w-[300px] h-[300px] sm:w-[512px] sm:h-[512px] justify-self-center"/>
            <div className="bg-[#99DBE1] w-[300px] sm:w-1/2 py-5 rounded-lg drop-shadow-lg">
                <p className="text-sm md:text-base">2 hours, 1 minute, 5 seconds without Nimi</p>
            </div>
        </main>
    );
};

export default Landing;