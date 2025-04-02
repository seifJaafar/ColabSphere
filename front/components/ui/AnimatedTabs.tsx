"use client";

import Image from "next/image";
import { Tabs } from "@/components/ui/Tabs";
import { TextGenerateEffect } from "./TextGenerateEffect";
const DummyContent = () => {
  return (
    <Image
      src="/githubScreen.webp"
      alt="Github image"
      width="1000"
      height="1000"
      className="object-cover object-left-top h-[60%] md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
    />
  );
};

export function AnimatedTabs() {
  const tabs = [
    {
      title: "Projects",
      value: "projects",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple to-violet-900">
          <p>Projects Tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Communication",
      value: "communication",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple to-violet-900">
          <p>Communication Tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Files",
      value: "files",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple to-violet-900">
          <p>Files Tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Diagrammes",
      value: "diagrammes",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple to-violet-900">
          <p>Diagrammes Tab</p>
          <DummyContent />
        </div>
      ),
    },
  ];

  return (
    <div
      className="h-[80vh] md:h-[100vh] relative flex flex-col max-w-5xl mx-auto w-full items-center justify-start my-40"
      id="features"
    >
      <TextGenerateEffect
        words="What We Offer"
        className="text-center text-[40px] md:text-5xl lg:text-6xl"
      />
      <div className="w-[40rem] h-40 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
        {/* Radial Gradient to prevent sharp edges */}
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
}
