import React from "react";
import { Meteors } from "@/components/ui/Meteors";
import { Cover } from "@/components/ui/cover";
export function JoinUs() {
  return (
    <div className="mt-10 mb-8">
      <div className=" w-full relative h-[50vh]">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
        <div className="relative shadow-xl bg-gray-900 border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-center items-center">
          <div>
            <h1 className="text-4xl md:text-4xl tracking-wide lg:text-6xl uppercase font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b  from-neutral-800 via-white to-white">
              What are you waiting for ? <br /> <Cover>Join Now</Cover>
            </h1>
          </div>
          <Meteors number={20} />
        </div>
      </div>
    </div>
  );
}
