import Hero from "@/components/static/Hero";
import FeaturesSection from "@/components/static/FeaturesSection";
import { AnimatedTabs } from "@/components/ui/AnimatedTabs";
import TestamonialsSection from "@/components/static/TestamonialsSection";
import { JoinUs } from "@/components/static/JoinUs";
export default function Home() {
  return (
    <main
      className="relative bg-black-100 flex 
    justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5"
    >
      <div className="max-w-7xl w-full">
        <Hero />
        <FeaturesSection />
        <AnimatedTabs />
        <TestamonialsSection />
        <JoinUs />
      </div>
    </main>
  );
}
