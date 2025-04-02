import React from "react";
import { Spotlight } from "@/components/ui/Spotlight";
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect";
import MagicButton from "@/components/ui/MagicButton";
import { FaLocationArrow } from "react-icons/fa";
const Hero = () => {
  return (
    <div className="pb-20 pt36 min-h-[100vh]" id="home">
      <div>
        <Spotlight
          fill="white"
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
        />
        <Spotlight
          fill="purple"
          className="top-10 left-full h-[80vh] w-[50vw]"
        />
        <Spotlight fill="blue" className="top-28 left-80 h-[80vh] w-[50vw]" />
      </div>
      <div className="h-screen w-full bg-black-100   bg-grid-white/[0.06]   flex items-center justify-center absolute top-0 left-0 z-0 min-h-[80vh]">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black-100 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>
      <div className="flex justify-center relative my-40 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <h2 className="uppercase tracking-widest text-xs text-center text-blue-100 max-w-90">
            Transforming the way teams collaborate and succeed
          </h2>
          <TextGenerateEffect
            words="Simplify Teamwork Supercharge Productivity"
            className="text-center text-[40px] md:text-5xl lg:text-6xl"
          />
          <p className="text-center md:tracking-wider mb-10 text-sm md:text-lg lg:text-2xl font-extralight">
            Empower your team with tools designed for efficiency and
            collaboration. From seamless task management to real-time
            communication, we help you stay organized, meet deadlines, and
            achieve success faster than ever
          </p>
          <a href="#aregister">
            <MagicButton title="Join now" icon={<FaLocationArrow />} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
